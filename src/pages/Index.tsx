import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { Recycle, BookOpen, Leaf, ArrowRight, Search, Calendar, Tag, Bot, Images, Trash2, Apple, Biohazard, Cpu, Wine, Anvil, Newspaper, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import "@/index.css";

const Index = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: featuredArticles } = useQuery({
        queryKey: ["featured-articles"],
        queryFn: async () => {
            const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(3);

            if (error) throw error;
            return data;
        },
    });

    const wasteTypes = [
        {
            icon: <Apple className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Organik",
            description: "Sampah mudah terurai seperti sisa makanan, daun, dan sayuran",
            color: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-600",
        },
        {
            icon: <Wine className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Plastik",
            description: "Botol plastik, kemasan, dan produk plastik lainnya",
            color: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-600",
        },
        {
            icon: <Newspaper className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Kertas",
            description: "Kertas, kardus, dan produk berbahan dasar kertas",
            color: "from-yellow-500/20 to-orange-500/20",
            iconColor: "text-yellow-600",
        },
        {
            icon: <Anvil className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Logam",
            description: "Kaleng, aluminium, dan material logam lainnya",
            color: "from-gray-500/20 to-slate-500/20",
            iconColor: "text-gray-600",
        },
        {
            icon: <Biohazard className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Berbahaya",
            description: "Baterai, lampu, dan limbah berbahaya lainnya",
            color: "from-red-500/20 to-rose-500/20",
            iconColor: "text-red-600",
        },
        {
            icon: <Cpu className="w-8 h-8 sm:w-10 sm:h-10" />,
            name: "Elektronik",
            description: "Perangkat elektronik, kabel, dan komponen e-waste",
            color: "from-purple-500/20 to-violet-500/20",
            iconColor: "text-purple-600",
        },
    ];

    const features = [
        {
            icon: <Search className="w-6 h-6" />,
            title: "Identifikasi Sampah",
            description: "Gunakan AI untuk mengidentifikasi jenis sampah dengan cepat dan akurat",
            action: () => navigate("/classification"),
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Artikel Edukasi",
            description: "Baca artikel mendalam tentang pengelolaan sampah dan lingkungan",
            action: () => navigate("/articles"),
        },
        {
            icon: <Images className="w-6 h-6" />,
            title: "Galeri Media",
            description: "Jelajahi koleksi gambar dan video edukatif",
            action: () => navigate("/gallery"),
        },
        {
            icon: <Bot className="w-6 h-6" />,
            title: "AI Assistant",
            description: "Chat dengan AI untuk pertanyaan seputar pengelolaan sampah",
            action: () => navigate("/chatbot"),
        },
    ];

    const faqs = [
        {
            question: "Apa itu SapuLidi?",
            answer: "SapuLidi adalah platform edukasi pengelolaan sampah yang menggunakan teknologi AI untuk membantu masyarakat mengidentifikasi jenis sampah dan cara pengelolaannya yang benar. Kami menyediakan berbagai fitur edukatif seperti artikel, galeri media, dan chatbot AI.",
        },
        {
            question: "Bagaimana cara menggunakan fitur identifikasi sampah?",
            answer: "Cukup klik tombol 'Mulai Identifikasi', upload foto sampah Anda, dan AI kami akan menganalisis jenis sampah tersebut beserta rekomendasi cara pengelolaannya. Anda perlu login terlebih dahulu untuk menggunakan fitur ini.",
        },
        {
            question: "Apakah SapuLidi gratis?",
            answer: "Ya, SapuLidi sepenuhnya gratis untuk digunakan. Kami percaya bahwa edukasi pengelolaan sampah harus dapat diakses oleh semua orang.",
        },
        {
            question: "Jenis sampah apa saja yang bisa diidentifikasi?",
            answer: "Sistem kami dapat mengidentifikasi berbagai jenis sampah termasuk organik, plastik, kertas, logam, elektronik, dan limbah berbahaya. AI kami terus belajar untuk meningkatkan akurasi identifikasi.",
        },
        {
            question: "Bagaimana cara berkontribusi ke SapuLidi?",
            answer: "Anda dapat berkontribusi dengan membagikan platform ini, memberikan feedback, atau menghubungi kami untuk kolaborasi. Setiap partisipasi membantu menyebarkan kesadaran tentang pentingnya pengelolaan sampah yang baik.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 mb-4">
                        <Recycle className="w-12 h-12 sm:w-14 sm:h-14 text-primary" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Kelola Sampah dengan <span className="text-primary">Cerdas</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Platform lengkap berbasis AI untuk edukasi pengelolaan sampah, identifikasi limbah, dan keberlanjutan lingkungan</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button size="lg" onClick={() => (user ? navigate("/classification") : navigate("/auth"))} className="gap-2 text-lg px-8 py-6 w-full sm:w-auto">
                            Mulai Identifikasi
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/articles")} className="gap-2 text-lg px-8 py-6 w-full sm:w-auto">
                            Jelajahi Artikel
                            <BookOpen className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Fitur Unggulan</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Jelajahi berbagai fitur yang kami tawarkan untuk membantu Anda mengelola sampah dengan lebih baik</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-xl transition-all cursor-pointer group" onClick={feature.action}>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <div className="text-primary">{feature.icon}</div>
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Waste Types Infinite Scroll Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Jenis Sampah yang Dapat Diklasifikasikan</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">AI kami dapat mengidentifikasi berbagai jenis sampah dengan akurasi tinggi</p>
                </div>

                <div className="max-w-7xl mx-auto overflow-hidden">
                    <div className="waste-scroll-container">
                        <div className="waste-scroll-track">
                            {/* Original items */}
                            {wasteTypes.map((type, index) => (
                                <div key={`original-${index}`} className="waste-scroll-item">
                                    <Card className={`bg-gradient-to-br border-none ${type.color} hover:shadow-lg transition-all h-full`}>
                                        <CardHeader className="text-center">
                                            <div className={`${type.iconColor} mx-auto mb-4`}>{type.icon}</div>
                                            <CardTitle className="text-2xl">{type.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-center text-muted-foreground">{type.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                            {/* Duplicated items for seamless loop */}
                            {wasteTypes.map((type, index) => (
                                <div key={`duplicate-${index}`} className="waste-scroll-item">
                                    <Card className={`bg-gradient-to-br border-none ${type.color} hover:shadow-lg transition-all h-full`}>
                                        <CardHeader className="text-center">
                                            <div className={`${type.iconColor} mx-auto mb-4`}>{type.icon}</div>
                                            <CardTitle className="text-2xl">{type.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-center text-muted-foreground">{type.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button size="lg" onClick={() => (user ? navigate("/classification") : navigate("/auth"))} className="gap-2">
                            <Trash2 className="w-5 h-5" />
                            Coba Identifikasi Sekarang
                        </Button>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            {featuredArticles && featuredArticles.length > 0 && (
                <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Artikel Edukasi Terbaru</h2>
                            <p className="text-lg text-muted-foreground">Pelajari lebih lanjut tentang pengelolaan sampah dan lingkungan</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate("/articles")} className="hidden sm:flex">
                            Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredArticles.map((article) => (
                            <Card key={article.id} className="cursor-pointer hover:shadow-xl transition-all group" onClick={() => navigate(`/article/${article.id}`)}>
                                {article.image_url && (
                                    <div className="overflow-hidden rounded-t-lg">
                                        <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                                    <CardDescription className="flex items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{format(new Date(article.created_at), "MMM dd, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            <span>{article.category}</span>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{article.content.replace(/<[^>]*>/g, "")}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8 sm:hidden">
                        <Button variant="outline" onClick={() => navigate("/articles")}>
                            Lihat Semua Artikel <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section id="faq" className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 ">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
                        <p className="text-lg text-muted-foreground">Temukan jawaban untuk pertanyaan umum seputar SapuLidi</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20">
                <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2">
                    <CardContent className="p-8 sm:p-12 md:p-16 text-center">
                        <Leaf className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Mulai Kelola Sampah dengan Lebih Baik</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Bergabunglah dengan ribuan pengguna yang sudah memanfaatkan SapuLidi untuk lingkungan yang lebih bersih dan berkelanjutan</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => (user ? navigate("/classification") : navigate("/auth"))} className="gap-2 text-lg px-8 py-6">
                                {user ? "Mulai Identifikasi" : "Daftar Sekarang"}
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate("/#contact")} className="gap-2 text-lg px-8 py-6">
                                Hubungi Kami
                                <Mail className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Contact Section */}
            <section id="contact" className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 ">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h2>
                        <p className="text-lg text-muted-foreground">Punya pertanyaan atau saran? Kami siap membantu Anda</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Email</h3>
                                <p className="text-muted-foreground mb-2">info@sapulidi.com</p>
                                <Button variant="link" size="sm" className="gap-1" onClick={() => window.open("mailto:info@sapulidi.com")}>
                                    Kirim Email <ExternalLink className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Telepon</h3>
                                <p className="text-muted-foreground mb-2">+62 823-4616-1609</p>
                                <Button variant="link" size="sm" className="gap-1" onClick={() => window.open("tel:+6281234567890")}>
                                    Hubungi <ExternalLink className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Alamat</h3>
                                <p className="text-muted-foreground mb-2">Ternate, Indonesia</p>
                                <Button variant="link" size="sm" className="gap-1" onClick={() => window.open("https://google.com/maps/place/ternate/data=!4m2!3m1!1s0x329cb3aacf502ab7:0xbbfce0fd52d156f9?sa=X&ved=1t:155783&ictx=111")}>
                                    Lihat Map <ExternalLink className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
