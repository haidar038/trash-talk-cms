import { supabase } from "@/integrations/supabase/client";

export async function uploadAvatar(userId: string, file: File): Promise<{ publicUrl: string | null; error: Error | null }> {
    try {
        // Validasi file
        if (!file.type.startsWith("image/")) {
            throw new Error("File must be an image");
        }

        const fileSize = file.size / 1024 / 1024; // Convert to MB
        if (fileSize > 2) {
            throw new Error("File size must be less than 2MB");
        }

        // Get file extension from mime type
        const mimeToExt: { [key: string]: string } = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
        };
        const fileExt = mimeToExt[file.type] || ".jpg";
        const fileName = `${userId}/avatar${fileExt}`;

        // Upload file ke bucket profile_avatars
        const { error: uploadError, data: uploadData } = await supabase.storage.from("profile_avatars").upload(fileName, file, {
            upsert: true,
            contentType: file.type,
        });

        if (uploadError) throw uploadError;

        // Get the public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("profile_avatars").getPublicUrl(fileName);

        if (!publicUrl) throw new Error("Failed to get public URL");

        // Update profile dengan URL avatar baru
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

        if (updateError) {
            // If profile update fails, delete the uploaded file
            await supabase.storage.from("profile_avatars").remove([fileName]);
            throw updateError;
        }

        return { publicUrl, error: null };
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return {
            publicUrl: null,
            error: error instanceof Error ? error : new Error("Unknown error"),
        };
    }
}

export async function deleteAvatar(userId: string): Promise<{ error: Error | null }> {
    try {
        // Hapus file dari storage
        const { error: deleteError } = await supabase.storage.from("profile_avatars").remove([`${userId}/avatar`]);

        if (deleteError) throw deleteError;

        // Update profile untuk menghapus URL avatar
        const { error: updateError } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);

        if (updateError) throw updateError;

        return { error: null };
    } catch (error) {
        console.error("Error deleting avatar:", error);
        return { error: error instanceof Error ? error : new Error("Unknown error") };
    }
}
