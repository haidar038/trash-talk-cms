import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar } from "@/utils/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const EditProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <Card className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
                <CardHeader className="p-4 sm:p-5 md:p-6">
                    <Skeleton className="h-6 w-24 sm:h-7 sm:w-28 md:h-8 md:w-32" />
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full" />
                        <Skeleton className="h-8 w-28 sm:h-9 sm:w-32" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <Skeleton className="h-3.5 w-20 sm:h-4 sm:w-24" />
                        <Skeleton className="h-9 w-full sm:h-10" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <Skeleton className="h-3.5 w-20 sm:h-4 sm:w-24" />
                        <Skeleton className="h-9 w-full sm:h-10" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                        <Skeleton className="h-9 flex-1 sm:h-10 md:h-11" />
                        <Skeleton className="h-9 flex-1 sm:h-10 md:h-11" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default function EditProfile() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [username, setUsername] = useState(profile?.username || "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || !event.target.files[0]) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileSize = file.size / 1024 / 1024; // in MB
            if (fileSize > 2) {
                throw new Error("File size must be less than 2MB");
            }

            if (!profile?.id) throw new Error("No user profile found");

            const { publicUrl, error } = await uploadAvatar(profile.id, file);
            if (error) throw error;

            if (publicUrl) {
                setAvatarUrl(publicUrl);
                toast({
                    title: "Success",
                    description: "Avatar updated successfully",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error uploading avatar",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    username: username,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });

            navigate("/profile");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error updating profile",
                variant: "destructive",
            });
        }
    };

    if (loading) return <EditProfileSkeleton />;
    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center px-4">
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Profil tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <Card className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto shadow-xl">
                    <CardHeader className="p-4 sm:p-5 md:p-6">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl">Edit Profil</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 md:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                            <div className="flex flex-col items-center gap-3 sm:gap-4">
                                <Avatar className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20">
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback className="text-base sm:text-lg md:text-xl">{profile.full_name?.[0] || profile.username?.[0] || "?"}</AvatarFallback>
                                </Avatar>

                                <div className="flex items-center">
                                    <Input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} className="hidden" id="avatar" />
                                    <Label
                                        htmlFor="avatar"
                                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 px-3 sm:h-9 sm:px-4 py-2"
                                    >
                                        {uploading ? "Mengunggah..." : "Ganti Avatar"}
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="fullName" className="text-xs sm:text-sm">Nama Lengkap</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Masukkan username"
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                                <Button type="submit" className="flex-1 text-xs sm:text-sm h-9 sm:h-10 md:h-11">
                                    Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate("/profile")} className="flex-1 text-xs sm:text-sm h-9 sm:h-10 md:h-11">
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
