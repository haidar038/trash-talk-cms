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

            if (!user?.id) throw new Error("No user logged in");

            const { publicUrl, error } = await uploadAvatar(user.id, file);
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

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{profile.full_name?.[0] || profile.username?.[0] || "?"}</AvatarFallback>
                            </Avatar>

                            <div className="flex items-center space-x-4">
                                <Input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} className="hidden" id="avatar" />
                                <Label
                                    htmlFor="avatar"
                                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
                                >
                                    {uploading ? "Uploading..." : "Change Avatar"}
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                        </div>

                        <div className="flex space-x-4">
                            <Button type="submit" className="flex-1">
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate("/profile")} className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
