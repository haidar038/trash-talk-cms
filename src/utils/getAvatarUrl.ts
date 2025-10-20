import { supabase } from "@/integrations/supabase/client";

export function getAvatarUrl(url: string | null): string | undefined {
    if (!url) return undefined;

    try {
        // Jika URL sudah lengkap dan valid, gunakan langsung
        if (url.startsWith("http")) {
            new URL(url); // Validate URL
            return url;
        }

        // Handle kasus dimana URL adalah path Supabase storage
        if (url.includes("profile_avatars")) {
            const {
                data: { publicUrl },
            } = supabase.storage.from("profile_avatars").getPublicUrl(url.replace("/storage/v1/object/public/", ""));
            return publicUrl;
        }

        // Jika bukan keduanya, return undefined
        return undefined;
    } catch (error) {
        console.error("Invalid avatar URL:", error);
        return undefined;
    }
}
