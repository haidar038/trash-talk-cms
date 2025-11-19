import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recycle, Target, Eye, Heart, Users, Lightbulb, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    const values = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Peduli Lingkungan",
            description: "Kami berkomitmen untuk menjaga kelestarian lingkungan melalui edukasi pengelolaan sampah yang tepat",
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Inovasi",
            description: "Menggunakan teknologi AI terkini untuk memberikan solusi cerdas dalam identifikasi dan pengelolaan sampah",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Kolaboratif",
            description: "Membangun komunitas yang peduli lingkungan dan saling berbagi pengetahuan",
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Terpercaya",
            description: "Menyediakan informasi akurat dan terverifikasi tentang pengelolaan sampah",
        },
    ];

    const milestones = [
        { year: "2024", title: "Peluncuran Platform", description: "SapuLidi resmi diluncurkan sebagai platform edukasi pengelolaan sampah" },
        { year: "2024", title: "Fitur AI Identification", description: "Menambahkan teknologi AI untuk identifikasi jenis sampah secara otomatis" },
        { year: "2024", title: "Komunitas Aktif", description: "Ribuan pengguna aktif menggunakan platform untuk belajar pengelolaan sampah" },
        { year: "2025", title: "Ekspansi Fitur", description: "Menambahkan galeri media, chatbot AI, dan artikel edukatif" },
    ];

    const team = [
        {
            name: "Tim Pengembang",
            role: "Development Team",
            description: "Tim yang berdedikasi untuk mengembangkan platform yang user-friendly dan inovatif",
        },
        {
            name: "Tim Konten",
            role: "Content Team",
            description: "Ahli lingkungan yang menyusun konten edukatif berkualitas tinggi",
        },
        {
            name: "Tim Riset",
            role: "Research Team",
            description: "Meneliti dan mengembangkan teknologi AI untuk identifikasi sampah",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                        <Recycle className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Tentang SapuLidi</h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Platform edukasi pengelolaan sampah berbasis AI yang berkomitmen untuk menciptakan Indonesia yang lebih bersih dan berkelanjutan
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-3xl">Misi Kami</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                Memberikan edukasi dan solusi praktis dalam pengelolaan sampah melalui teknologi AI, membantu masyarakat Indonesia memahami pentingnya pengelolaan limbah yang baik, dan berkontribusi dalam menciptakan
                                lingkungan yang lebih bersih dan berkelanjutan.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                    <span>Meningkatkan kesadaran masyarakat tentang pengelolaan sampah</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                    <span>Menyediakan teknologi AI untuk identifikasi sampah yang akurat</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                    <span>Membangun komunitas peduli lingkungan yang aktif</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-2">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                                <Eye className="w-6 h-6 text-accent" />
                            </div>
                            <CardTitle className="text-3xl">Visi Kami</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                Menjadi platform edukasi pengelolaan sampah terdepan di Indonesia yang memberdayakan masyarakat dengan teknologi AI, menciptakan budaya sadar lingkungan, dan berkontribusi signifikan dalam mengurangi dampak
                                sampah terhadap ekosistem.
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                                    <span>Indonesia bebas dari pencemaran sampah pada tahun 2030</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                                    <span>Masyarakat yang sadar dan aktif dalam pengelolaan sampah</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                                    <span>Ekosistem teknologi hijau yang berkelanjutan</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Values Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 bg-muted/30">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Nilai-Nilai Kami</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Prinsip yang memandu setiap langkah kami dalam menciptakan perubahan positif</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {values.map((value, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <div className="text-primary">{value.icon}</div>
                                </div>
                                <CardTitle className="text-xl">{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Milestones Timeline */}
            {/* <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Perjalanan Kami</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tonggak penting dalam perkembangan SapuLidi</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="relative pl-0 sm:pl-20">
                                    <div className="absolute left-[30px] top-2 w-3 h-3 rounded-full bg-primary border-4 border-background hidden sm:block" />

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="px-3 py-1 bg-primary/10 rounded-full">
                                                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                                                </div>
                                                <TrendingUp className="w-5 h-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl">{milestone.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{milestone.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Team Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16 ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Tim Kami</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Orang-orang berdedikasi di balik SapuLidi</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {team.map((member, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{member.name}</CardTitle>
                                <p className="text-sm text-primary font-medium">{member.role}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{member.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 sm:px-6 md:px-8 py-16">
                <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2">
                    <CardContent className="p-8 sm:p-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Bergabunglah dengan Kami</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Mari bersama-sama menciptakan Indonesia yang lebih bersih dan berkelanjutan</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => navigate("/classification")} className="gap-2">
                                Mulai Sekarang
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate("/#contact")}>
                                Hubungi Kami
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default About;
