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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <Card className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
                <CardHeader className="p-4 sm:p-5 md:p-6">
                    <Skeleton className="h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28" />
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                        <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-32 sm:h-7 sm:w-40 md:h-8 md:w-48" />
                            <Skeleton className="h-4 w-24 sm:h-5 sm:w-28 md:h-6 md:w-32" />
                            <Skeleton className="h-5 w-12 sm:h-5 sm:w-14 md:h-6 md:w-16" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-full sm:h-10 md:h-11" />
                    </div>
                </CardContent>
            </Card>
        </div>
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
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl">Profil</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                            <Avatar className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 flex-shrink-0">
                                <AvatarImage src={getAvatarUrl(profile.avatar_url)} />
                                <AvatarFallback className="text-base sm:text-lg md:text-xl">{profile.full_name?.[0] || profile.username?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{profile.full_name}</h2>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">@{profile.username}</p>
                                <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="text-xs sm:text-sm mt-1 sm:mt-1.5">
                                    {profile.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button variant="outline" className="w-full text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-11" onClick={() => navigate("/profile/edit")}>
                                Edit Profil
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
