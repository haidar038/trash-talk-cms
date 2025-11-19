import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 px-4 sm:px-6 py-6 sm:py-8">
            <Card className="max-w-sm sm:max-w-md md:max-w-lg shadow-xl">
                <CardContent className="p-6 sm:p-8 md:p-10 text-center">
                    <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-destructive" />
                        </div>
                    </div>
                    <h1 className="mb-2 sm:mb-3 text-5xl sm:text-6xl md:text-7xl font-bold text-primary">404</h1>
                    <h2 className="mb-1 sm:mb-2 text-lg sm:text-xl md:text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
                    <p className="mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base text-muted-foreground px-2">
                        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                        <Button onClick={() => navigate("/")} className="text-xs sm:text-sm h-9 sm:h-10 md:h-11">
                            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            Kembali ke Beranda
                        </Button>
                        <Button onClick={() => navigate(-1)} variant="outline" className="text-xs sm:text-sm h-9 sm:h-10 md:h-11">
                            Kembali
                        </Button>
                    </div>
                    <p className="mt-4 sm:mt-5 md:mt-6 text-[10px] sm:text-xs text-muted-foreground">
                        Path: <code className="bg-muted px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">{location.pathname}</code>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;
