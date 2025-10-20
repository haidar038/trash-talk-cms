import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAvatarUrl } from "@/utils/getAvatarUrl";

export default function Profile() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={getAvatarUrl(profile.avatar_url)} />
                            <AvatarFallback>{profile.full_name?.[0] || profile.username?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                            <p className="text-gray-500">@{profile.username}</p>
                            <Badge variant={profile.role === "admin" ? "default" : "secondary"}>{profile.role}</Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => navigate("/profile/edit")}>
                            Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
