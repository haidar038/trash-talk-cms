export function getAvatarUrl(url: string | null): string | undefined {
    if (!url) {
        return undefined;
    }

    try {
        // Pastikan URL adalah URL http yang valid
        if (url.startsWith("http")) {
            new URL(url); // Ini akan error jika URL tidak valid
            return url;
        }
        return undefined;
    } catch (error) {
        console.error("Invalid avatar URL provided:", url, error);
        return undefined;
    }
}
