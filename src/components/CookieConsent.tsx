import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Cookie, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CookiePreferences {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
}

const CookieConsent = () => {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true, cannot be disabled
        functional: true,
        analytics: true,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consentGiven = localStorage.getItem("sapulidi_cookie_consent");
        if (!consentGiven) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        } else {
            // Load saved preferences
            try {
                const savedPreferences = JSON.parse(consentGiven);
                setPreferences(savedPreferences);
            } catch (error) {
                console.error("Error parsing cookie preferences:", error);
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            functional: true,
            analytics: true,
        };
        savePreferences(allAccepted);
        setShowBanner(false);
        setShowSettings(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            functional: false,
            analytics: false,
        };
        savePreferences(onlyNecessary);
        setShowBanner(false);
        setShowSettings(false);
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
        setShowBanner(false);
        setShowSettings(false);
    };

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem("sapulidi_cookie_consent", JSON.stringify(prefs));
        localStorage.setItem("sapulidi_cookie_consent_date", new Date().toISOString());

        // Apply preferences
        if (!prefs.analytics) {
            // Disable analytics tracking if user opted out
            // You can add your analytics disable code here
            console.log("Analytics cookies disabled");
        }
        if (!prefs.functional) {
            // Disable functional cookies if user opted out
            console.log("Functional cookies disabled");
        }
    };

    const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
        if (key === "necessary") return; // Necessary cookies cannot be disabled
        setPreferences((prev) => ({ ...prev, [key]: value }));
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Cookie Consent Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
                <div className="container mx-auto max-w-6xl pointer-events-auto">
                    <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                                {/* Icon and Content */}
                                <div className="flex gap-3 sm:gap-4 flex-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Kami Menggunakan Cookie</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                            Kami menggunakan cookie untuk meningkatkan pengalaman Anda, menganalisis lalu lintas situs, dan mempersonalisasi konten. Dengan mengklik "Terima Semua", Anda menyetujui penggunaan cookie kami. Lihat{" "}
                                            <button onClick={() => navigate("/privacy")} className="text-primary hover:underline font-medium">
                                                Kebijakan Privasi
                                            </button>{" "}
                                            kami untuk informasi lebih lanjut.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
                                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="w-full sm:w-auto whitespace-nowrap">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Pengaturan
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-xl">
                                                    <Cookie className="w-5 h-5 text-primary" />
                                                    Pengaturan Cookie
                                                </DialogTitle>
                                                <DialogDescription>Kelola preferensi cookie Anda. Cookie yang diperlukan tidak dapat dinonaktifkan karena penting untuk fungsi dasar situs.</DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 py-4">
                                                {/* Necessary Cookies */}
                                                <Card className="border-2">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox id="necessary" checked={preferences.necessary} disabled className="mt-1" />
                                                            <div className="flex-1">
                                                                <label htmlFor="necessary" className="font-semibold text-base cursor-not-allowed">
                                                                    Cookie yang Diperlukan
                                                                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Wajib</span>
                                                                </label>
                                                                <p className="text-sm text-muted-foreground mt-1">Cookie ini penting untuk fungsi dasar situs seperti autentikasi, keamanan, dan navigasi. Tidak dapat dinonaktifkan.</p>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    <strong>Contoh:</strong> Session cookies, authentication tokens, CSRF protection
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Functional Cookies */}
                                                <Card className="border-2">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox id="functional" checked={preferences.functional} onCheckedChange={(checked) => handlePreferenceChange("functional", checked as boolean)} className="mt-1" />
                                                            <div className="flex-1">
                                                                <label htmlFor="functional" className="font-semibold text-base cursor-pointer">
                                                                    Cookie Fungsional
                                                                </label>
                                                                <p className="text-sm text-muted-foreground mt-1">Cookie ini memungkinkan kami untuk mengingat preferensi Anda seperti tema, bahasa, dan pengaturan lainnya untuk memberikan pengalaman yang lebih personal.</p>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    <strong>Contoh:</strong> Theme preference, language settings, user preferences
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Analytics Cookies */}
                                                <Card className="border-2">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox id="analytics" checked={preferences.analytics} onCheckedChange={(checked) => handlePreferenceChange("analytics", checked as boolean)} className="mt-1" />
                                                            <div className="flex-1">
                                                                <label htmlFor="analytics" className="font-semibold text-base cursor-pointer">
                                                                    Cookie Analitik
                                                                </label>
                                                                <p className="text-sm text-muted-foreground mt-1">Cookie ini membantu kami memahami bagaimana pengunjung berinteraksi dengan situs kami dengan mengumpulkan dan melaporkan informasi secara anonim untuk meningkatkan layanan kami.</p>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    <strong>Contoh:</strong> Google Analytics, usage statistics, performance monitoring
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                                                <Button variant="outline" onClick={handleRejectAll} className="flex-1">
                                                    Tolak Semua
                                                </Button>
                                                <Button onClick={handleSavePreferences} className="flex-1">
                                                    Simpan Preferensi
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="outline" size="sm" onClick={handleRejectAll} className="w-full sm:w-auto whitespace-nowrap">
                                        Tolak Semua
                                    </Button>
                                    <Button size="sm" onClick={handleAcceptAll} className="w-full sm:w-auto whitespace-nowrap">
                                        Terima Semua
                                    </Button>
                                </div>

                                {/* Close Button */}
                                <button onClick={handleRejectAll} className="absolute top-2 right-2 lg:hidden p-1 hover:bg-muted rounded-full transition-colors" aria-label="Close">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
