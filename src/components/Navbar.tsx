import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut, BookOpen, Image as ImageIcon, User as UserIcon, LayoutDashboard, History, Images, Bot, Mail, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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

                    <nav className="ml-6 hidden md:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                                        <Home className="w-4 h-4 mr-2" />
                                        Home
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <div
                                                        onClick={() => navigate("/articles")}
                                                        className="flex h-full w-full select-none border flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors group"
                                                    >
                                                        <BookOpen className="h-6 w-6" />
                                                        <div className="mb-2 mt-4 text-lg font-medium">Edukasi</div>
                                                        <p className="text-sm leading-tight text-muted-foreground group-hover:text-white">Baca artikel edukatif tentang pengelolaan sampah dan lingkungan</p>
                                                    </div>
                                                </NavigationMenuLink>
                                            </li>
                                            <ListItem onClick={() => navigate("/gallery")} title="Galeri" icon={<Images className="h-4 w-4 mr-2" />}>
                                                Lihat koleksi gambar dan video edukasi
                                            </ListItem>
                                            <ListItem onClick={() => navigate("/classification")} title="Identifikasi" icon={<ImageIcon className="h-4 w-4 mr-2" />}>
                                                Klasifikasi jenis sampah dengan AI
                                            </ListItem>
                                            {user && (
                                                <ListItem onClick={() => navigate("/classification/history")} title="Riwayat" icon={<History className="h-4 w-4 mr-2" />}>
                                                    Lihat riwayat klasifikasi sampah
                                                </ListItem>
                                            )}
                                            <ListItem onClick={() => navigate("/chatbot")} title="Assistant" icon={<Bot className="h-4 w-4 mr-2" />}>
                                                Chat dengan AI tentang pengelolaan sampah
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
                                        <Info className="w-4 h-4 mr-2" />
                                        Tentang
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => navigate("/#contact")} style={{ cursor: "pointer" }}>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Hubungi Kami
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex lg:items-center lg:gap-2">
                            {isAdmin && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => navigate("/admin/gallery")}>
                                        <Images className="w-4 h-4 mr-2" />
                                        Kelola Galeri
                                    </Button>
                                </>
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
                                        <>
                                            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/admin/gallery")}>
                                                <Images className="w-4 h-4 mr-2" />
                                                Kelola Galeri
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate("/")}>
                                        <Home className="w-4 h-4 mr-2" />
                                        Home
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Features</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigate("/articles")}>
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Edukasi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/gallery")}>
                                        <Images className="w-4 h-4 mr-2" />
                                        Galeri
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/classification")}>
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Identifikasi
                                    </DropdownMenuItem>
                                    {user && (
                                        <DropdownMenuItem onClick={() => navigate("/classification/history")}>
                                            <History className="w-4 h-4 mr-2" />
                                            Riwayat
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate("/chatbot")}>
                                        <Bot className="w-4 h-4 mr-2" />
                                        Assistant
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate("/#about")}>
                                        <Info className="w-4 h-4 mr-2" />
                                        About
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/#contact")}>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
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

const ListItem = ({ className, title, children, icon, onClick, ...props }: { className?: string; title: string; children: React.ReactNode; icon?: React.ReactNode; onClick: () => void }) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <div
                    onClick={onClick}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer group",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center text-sm font-medium leading-none">
                        {icon}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-white">{children}</p>
                </div>
            </NavigationMenuLink>
        </li>
    );
};

export default Navbar;
