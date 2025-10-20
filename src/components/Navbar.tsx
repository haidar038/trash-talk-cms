import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut, BookOpen, Image as ImageIcon, User as UserIcon, Settings, LayoutDashboard, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, profile, isAdmin, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/SPL.png" alt="SapuLidi" className="max-h-10 object-contain" />
                    <div>
                        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                            SapuLidi
                        </h1>
                        {profile && <p className="text-sm text-muted-foreground">{profile.username}</p>}
                    </div>

                    <nav className="ml-6 hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                                        <Home className="w-4 h-4 mr-2" />
                                        Beranda
                                    </Button>

                                    <Button variant="ghost" size="sm" onClick={() => navigate("/articles")}>
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Edukasi
                                    </Button>

                                    <Button variant="ghost" size="sm" onClick={() => navigate("/classification")}>
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Identifikasi
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                                    <Home className="w-4 h-4 mr-2" />
                                    Beranda
                                </Button>

                                <Button variant="ghost" size="sm" onClick={() => navigate("/articles")}>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Edukasi
                                </Button>
                            </>
                        )}
                    </nav>
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:block">
                            {isAdmin && (
                                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Button>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={profile?.avatar_url || undefined} />
                                    <AvatarFallback>{profile?.full_name?.[0] || profile?.username?.[0] || user.email?.[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>{profile?.full_name || profile?.username || user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="block lg:hidden">
                                    {isAdmin && (
                                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate("/classification")}>
                                        <Search className="w-4 h-4 mr-2" />
                                        Identifikasi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/articles")}>
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Edukasi
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Profil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                        <UserIcon className="w-4 h-4 mr-2" />
                        Masuk
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
