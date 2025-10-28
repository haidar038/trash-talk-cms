import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
    <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
);

export default function Profile() {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    if (loading) return <ProfileSkeleton />;
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
