import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Recycle, Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter, Facebook, ExternalLink, Cookie } from "lucide-react";

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleManageCookies = () => {
        localStorage.removeItem("sapulidi_cookie_consent");
        window.location.reload();
    };

    const footerLinks = {
        platform: [
            { label: "Beranda", path: "/" },
            { label: "Tentang Kami", path: "/about" },
            { label: "Artikel", path: "/articles" },
            { label: "Galeri", path: "/gallery" },
        ],
        fitur: [
            { label: "Identifikasi Sampah", path: "/classification" },
            { label: "Riwayat", path: "/classification/history" },
            { label: "AI Assistant", path: "/chatbot" },
            { label: "Dashboard", path: "/dashboard" },
        ],
        bantuan: [
            { label: "FAQ", path: "/#faq" },
            { label: "Hubungi Kami", path: "/#contact" },
            { label: "Kebijakan Privasi", path: "/privacy" },
            { label: "Syarat & Ketentuan", path: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: <Github className="w-5 h-5" />, url: "https://github.com", label: "GitHub" },
        { icon: <Instagram className="w-5 h-5" />, url: "https://instagram.com", label: "Instagram" },
        { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com", label: "Twitter" },
        { icon: <Facebook className="w-5 h-5" />, url: "https://facebook.com", label: "Facebook" },
        { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com", label: "LinkedIn" },
    ];

    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                {/* Main Footer Content */}
                <div className="py-12 sm:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Recycle className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold">
                                    Sapu<span className="text-primary">Lidi</span>
                                </h3>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">Platform edukasi pengelolaan sampah berbasis AI yang membantu masyarakat Indonesia untuk mengelola limbah dengan lebih baik dan berkelanjutan.</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span>info@sapulidi.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span>+62 823-4616-1609</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>Ternate, Indonesia</span>
                                </div>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Platform</h4>
                            <ul className="space-y-3">
                                {footerLinks.platform.map((link, index) => (
                                    <li key={index}>
                                        <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={() => navigate(link.path)}>
                                            {link.label}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fitur Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Fitur</h4>
                            <ul className="space-y-3">
                                {footerLinks.fitur.map((link, index) => (
                                    <li key={index}>
                                        <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={() => navigate(link.path)}>
                                            {link.label}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bantuan Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Bantuan</h4>
                            <ul className="space-y-3">
                                {footerLinks.bantuan.map((link, index) => (
                                    <li key={index}>
                                        <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={() => navigate(link.path)}>
                                            {link.label}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Bottom Footer */}
                <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <p className="text-sm text-muted-foreground text-center sm:text-left">
                            &copy; {currentYear} SapuLidi. All rights reserved. Made with <span className="text-red-500">♥</span> for a better environment.
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={handleManageCookies}>
                            <Cookie className="w-3 h-3 mr-1" />
                            Kelola Cookie
                        </Button>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((social, index) => (
                            <Button key={index} variant="ghost" size="icon" className="h-9 w-9 hover:text-primary" onClick={() => window.open(social.url, "_blank")} aria-label={social.label}>
                                {social.icon}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
