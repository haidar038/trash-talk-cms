import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Gunakan service role key untuk akses penuh

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
}

// Buat client dengan service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function untuk download avatar dari URL
async function downloadAvatar(url: string): Promise<Buffer | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch avatar: ${response.statusText}`);
        return Buffer.from(await response.arrayBuffer());
    } catch (error) {
        console.error(`Error downloading avatar from ${url}:`, error);
        return null;
    }
}

// Function untuk upload avatar ke Supabase Storage
async function uploadAvatar(userId: string, avatarBuffer: Buffer, fileExt: string): Promise<string | null> {
    try {
        const fileName = `${userId}/avatar${fileExt}`;
        const { error } = await supabase.storage.from("profile_avatars").upload(fileName, avatarBuffer, {
            contentType: `image/${fileExt.slice(1)}`,
            upsert: true,
        });

        if (error) throw error;

        const {
            data: { publicUrl },
        } = supabase.storage.from("profile_avatars").getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error(`Error uploading avatar for user ${userId}:`, error);
        return null;
    }
}

async function migrateProfiles() {
    console.log("Starting profile migration...");

    // Ambil semua users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
        throw usersError;
    }

    console.log(`Found ${users.users.length} users to migrate`);

    // Proses setiap user
    for (const user of users.users) {
        let avatarUrl = null;

        // Handle existing avatar
        if (user.user_metadata?.avatar_url) {
            const oldAvatarUrl = user.user_metadata.avatar_url;
            const fileExt = oldAvatarUrl.match(/\.(jpg|jpeg|png|gif)$/i)?.[0] || ".jpg";

            // Download and upload avatar ke bucket baru
            const avatarBuffer = await downloadAvatar(oldAvatarUrl);
            if (avatarBuffer) {
                avatarUrl = await uploadAvatar(user.id, avatarBuffer, fileExt);
            }
        }

        const profileData = {
            id: user.id,
            username: user.user_metadata?.username || user.email?.split("@")[0],
            full_name: user.user_metadata?.full_name || null,
            avatar_url: avatarUrl,
            role: "user", // Default role
            updated_at: new Date().toISOString(),
        };

        // Upsert ke tabel profiles
        const { error: upsertError } = await supabase.from("profiles").upsert(profileData);

        if (upsertError) {
            console.error(`Failed to migrate profile for user ${user.id}:`, upsertError);
        } else {
            console.log(`Successfully migrated profile for user ${user.id}`);
        }
    }

    console.log("Migration completed");
}

// Jalankan migrasi
migrateProfiles()
    .catch(console.error)
    .finally(() => process.exit(0));
