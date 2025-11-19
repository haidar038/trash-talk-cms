import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 max-w-4xl">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Syarat & Ketentuan</h1>
                    <p className="text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="prose prose-sm sm:prose-base max-w-none">
                            <p className="text-muted-foreground mb-6">
                                Selamat datang di SapuLidi. Dengan mengakses dan menggunakan platform ini, Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut. Mohon baca dengan seksama sebelum menggunakan layanan kami.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>1. Penerimaan Syarat</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Dengan mengakses atau menggunakan SapuLidi, Anda setuju untuk mematuhi dan terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan
                                layanan kami.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>2. Deskripsi Layanan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">SapuLidi adalah platform edukasi pengelolaan sampah berbasis web yang menyediakan:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Fitur klasifikasi sampah menggunakan teknologi AI (Artificial Intelligence)</li>
                                <li>Artikel edukatif tentang pengelolaan sampah dan lingkungan</li>
                                <li>Galeri media edukatif berupa gambar dan video</li>
                                <li>Chatbot AI untuk konsultasi pengelolaan sampah</li>
                                <li>Riwayat klasifikasi untuk pengguna terdaftar</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>3. Akun Pengguna</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground font-semibold">3.1 Pendaftaran Akun</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Anda harus membuat akun untuk menggunakan fitur tertentu (klasifikasi sampah, riwayat, chatbot)</li>
                                <li>Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda</li>
                                <li>Anda harus memberikan informasi yang akurat dan lengkap saat mendaftar</li>
                                <li>Anda bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda</li>
                            </ul>

                            <p className="text-muted-foreground font-semibold mt-4">3.2 Keamanan Akun</p>
                            <p className="text-muted-foreground">
                                Anda setuju untuk segera memberi tahu kami jika ada penggunaan tidak sah atas akun Anda atau pelanggaran keamanan lainnya. Kami tidak bertanggung jawab atas kerugian yang timbul dari kegagalan Anda untuk
                                mematuhi persyaratan keamanan ini.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>4. Penggunaan Layanan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground font-semibold">4.1 Penggunaan yang Diizinkan</p>
                            <p className="text-muted-foreground">Anda setuju untuk menggunakan SapuLidi hanya untuk tujuan yang sah dan sesuai dengan syarat dan ketentuan ini. Anda tidak boleh menggunakan layanan kami untuk:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Melanggar hukum atau peraturan yang berlaku</li>
                                <li>Mengirimkan konten yang menyesatkan, menipu, atau palsu</li>
                                <li>Mengunggah gambar yang mengandung konten ilegal, cabul, atau tidak pantas</li>
                                <li>Mencoba mengakses sistem atau data tanpa otorisasi</li>
                                <li>Mengganggu atau merusak integritas atau kinerja layanan</li>
                                <li>Menggunakan bot, crawler, atau metode otomatis lainnya tanpa izin</li>
                            </ul>

                            <p className="text-muted-foreground font-semibold mt-4">4.2 Fitur Klasifikasi AI</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Hasil klasifikasi AI bersifat estimasi dan tidak 100% akurat</li>
                                <li>Kami tidak bertanggung jawab atas keputusan yang diambil berdasarkan hasil klasifikasi</li>
                                <li>Pengguna disarankan untuk memverifikasi hasil dengan sumber profesional jika diperlukan</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>5. Konten Pengguna</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">Dengan mengunggah gambar atau konten lainnya ke SapuLidi, Anda menyatakan bahwa:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Anda memiliki hak untuk mengunggah konten tersebut</li>
                                <li>Konten tidak melanggar hak kekayaan intelektual pihak ketiga</li>
                                <li>Anda memberikan kami lisensi non-eksklusif untuk menggunakan konten tersebut dalam penyediaan layanan</li>
                                <li>Kami berhak menghapus konten yang melanggar syarat dan ketentuan ini</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>6. Hak Kekayaan Intelektual</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">
                                Semua konten, fitur, dan fungsi layanan (termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, kompilasi data, dan perangkat lunak) adalah milik SapuLidi atau
                                pemberi lisensinya dan dilindungi oleh hukum kekayaan intelektual Indonesia dan internasional.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>7. Penafian dan Batasan Tanggung Jawab</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground font-semibold">7.1 Penafian</p>
                            <p className="text-muted-foreground">
                                Layanan disediakan "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa layanan akan bebas dari kesalahan, aman, atau tidak terputus.
                            </p>

                            <p className="text-muted-foreground font-semibold mt-4">7.2 Batasan Tanggung Jawab</p>
                            <p className="text-muted-foreground">
                                Dalam batas maksimum yang diizinkan oleh hukum, SapuLidi tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, konsekuensial, atau punitif yang timbul dari atau terkait dengan
                                penggunaan atau ketidakmampuan menggunakan layanan.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>8. Privasi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Penggunaan layanan kami juga diatur oleh Kebijakan Privasi kami. Silakan tinjau Kebijakan Privasi kami untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>9. Perubahan Layanan dan Syarat</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan atau bagian mana pun darinya kapan saja dengan atau tanpa pemberitahuan. Kami juga dapat memperbarui syarat dan ketentuan ini dari waktu
                                ke waktu. Perubahan akan berlaku segera setelah diposting di platform.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>10. Penghentian</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Kami dapat menghentikan atau menangguhkan akses Anda ke layanan tanpa pemberitahuan sebelumnya jika Anda melanggar syarat dan ketentuan ini atau jika penggunaan Anda merugikan pengguna lain atau layanan kami.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>11. Hukum yang Berlaku</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau terkait dengan syarat ini akan diselesaikan di pengadilan yang berwenang
                                di Ternate, Indonesia.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>12. Hubungi Kami</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <strong>Email:</strong> info@sapulidi.com
                                </li>
                                <li>
                                    <strong>Telepon:</strong> +62 823-4616-1609
                                </li>
                                <li>
                                    <strong>Alamat:</strong> Ternate, Indonesia
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <Button onClick={() => navigate(-1)} size="lg">
                        Saya Mengerti
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
