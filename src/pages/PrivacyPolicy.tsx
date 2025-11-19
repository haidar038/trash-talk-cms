import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";

const PrivacyPolicy = () => {
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
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Kebijakan Privasi</h1>
                    <p className="text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="prose prose-sm sm:prose-base max-w-none">
                            <p className="text-muted-foreground mb-6">
                                SapuLidi menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda
                                ketika Anda menggunakan platform kami.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>1. Informasi yang Kami Kumpulkan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">1.1 Informasi yang Anda Berikan</p>
                                <p className="text-muted-foreground mb-2">Kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk:</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>
                                        <strong>Informasi Akun:</strong> Email, nama lengkap, username, dan kata sandi saat Anda membuat akun
                                    </li>
                                    <li>
                                        <strong>Informasi Profil:</strong> Foto profil (avatar), bio, dan informasi lain yang Anda tambahkan ke profil Anda
                                    </li>
                                    <li>
                                        <strong>Konten:</strong> Gambar sampah yang Anda unggah untuk klasifikasi, interaksi dengan chatbot, dan komentar pada artikel
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">1.2 Informasi yang Dikumpulkan Secara Otomatis</p>
                                <p className="text-muted-foreground mb-2">Ketika Anda menggunakan platform kami, kami secara otomatis mengumpulkan:</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>
                                        <strong>Data Penggunaan:</strong> Halaman yang Anda kunjungi, waktu akses, durasi kunjungan, dan fitur yang digunakan
                                    </li>
                                    <li>
                                        <strong>Data Perangkat:</strong> Jenis perangkat, sistem operasi, browser, alamat IP, dan pengidentifikasi perangkat unik
                                    </li>
                                    <li>
                                        <strong>Riwayat Klasifikasi:</strong> Gambar yang diunggah, hasil klasifikasi AI, timestamp, dan metadata terkait
                                    </li>
                                    <li>
                                        <strong>Cookie dan Teknologi Pelacakan:</strong> Cookie, web beacons, dan teknologi serupa untuk meningkatkan pengalaman pengguna
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">1.3 Informasi dari Layanan Pihak Ketiga</p>
                                <p className="text-muted-foreground">
                                    Kami menggunakan layanan pihak ketiga seperti Supabase untuk autentikasi dan penyimpanan data, serta Puter.js dengan OpenAI untuk fitur AI. Informasi yang dikumpulkan oleh layanan ini tunduk pada
                                    kebijakan privasi masing-masing penyedia.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>2. Bagaimana Kami Menggunakan Informasi Anda</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-3">Kami menggunakan informasi yang dikumpulkan untuk tujuan berikut:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>
                                    <strong>Penyediaan Layanan:</strong> Memproses klasifikasi sampah, menyimpan riwayat, dan menyediakan fitur chatbot AI
                                </li>
                                <li>
                                    <strong>Manajemen Akun:</strong> Membuat dan mengelola akun Anda, termasuk autentikasi dan otorisasi
                                </li>
                                <li>
                                    <strong>Personalisasi:</strong> Menyesuaikan konten dan rekomendasi berdasarkan preferensi dan riwayat penggunaan Anda
                                </li>
                                <li>
                                    <strong>Peningkatan Layanan:</strong> Menganalisis penggunaan untuk meningkatkan fitur, akurasi AI, dan pengalaman pengguna
                                </li>
                                <li>
                                    <strong>Komunikasi:</strong> Mengirimkan pemberitahuan penting, pembaruan layanan, dan informasi edukatif
                                </li>
                                <li>
                                    <strong>Keamanan:</strong> Mendeteksi dan mencegah penipuan, penyalahgunaan, dan aktivitas berbahaya
                                </li>
                                <li>
                                    <strong>Kepatuhan Hukum:</strong> Mematuhi kewajiban hukum, proses hukum, dan permintaan pemerintah yang sah
                                </li>
                                <li>
                                    <strong>Riset dan Pengembangan:</strong> Melatih dan meningkatkan model AI untuk hasil klasifikasi yang lebih akurat
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>3. Bagaimana Kami Membagikan Informasi Anda</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">Kami tidak menjual data pribadi Anda. Kami hanya membagikan informasi Anda dalam situasi berikut:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>
                                    <strong>Penyedia Layanan:</strong> Dengan pihak ketiga yang membantu kami mengoperasikan platform (misalnya, Supabase untuk hosting database, OpenAI untuk pemrosesan AI)
                                </li>
                                <li>
                                    <strong>Kepatuhan Hukum:</strong> Jika diwajibkan oleh hukum atau untuk menanggapi proses hukum yang sah
                                </li>
                                <li>
                                    <strong>Perlindungan Hak:</strong> Untuk melindungi hak, properti, atau keselamatan SapuLidi, pengguna kami, atau publik
                                </li>
                                <li>
                                    <strong>Dengan Persetujuan Anda:</strong> Dengan persetujuan eksplisit Anda untuk tujuan tertentu
                                </li>
                                <li>
                                    <strong>Transaksi Bisnis:</strong> Dalam hal merger, akuisisi, atau penjualan aset (dengan pemberitahuan kepada Anda)
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>4. Penyimpanan dan Keamanan Data</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">4.1 Penyimpanan Data</p>
                                <p className="text-muted-foreground">
                                    Data Anda disimpan di server yang dikelola oleh Supabase, yang menggunakan infrastruktur cloud yang aman dan terpercaya. Data disimpan di lokasi yang sesuai dengan peraturan perlindungan data yang
                                    berlaku.
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">4.2 Keamanan Data</p>
                                <p className="text-muted-foreground mb-2">Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data Anda, termasuk:</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Enkripsi data saat transit menggunakan HTTPS/TLS</li>
                                    <li>Enkripsi data saat disimpan (at-rest encryption)</li>
                                    <li>Autentikasi multi-faktor untuk akun admin</li>
                                    <li>Kontrol akses berbasis peran (RBAC)</li>
                                    <li>Pemantauan keamanan dan audit log secara berkala</li>
                                    <li>Backup data secara teratur</li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">4.3 Retensi Data</p>
                                <p className="text-muted-foreground">
                                    Kami menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan. Jika Anda menghapus akun, kami akan menghapus atau menganonimkan data Anda dalam waktu 90 hari,
                                    kecuali kami diwajibkan oleh hukum untuk menyimpannya lebih lama.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>5. Hak Privasi Anda</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-3">Anda memiliki hak-hak berikut terkait data pribadi Anda:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>
                                    <strong>Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda
                                </li>
                                <li>
                                    <strong>Koreksi:</strong> Meminta koreksi data yang tidak akurat atau tidak lengkap
                                </li>
                                <li>
                                    <strong>Penghapusan:</strong> Meminta penghapusan data pribadi Anda (hak untuk dilupakan)
                                </li>
                                <li>
                                    <strong>Portabilitas:</strong> Meminta transfer data Anda ke layanan lain dalam format yang dapat dibaca mesin
                                </li>
                                <li>
                                    <strong>Pembatasan:</strong> Meminta pembatasan pemrosesan data Anda dalam situasi tertentu
                                </li>
                                <li>
                                    <strong>Keberatan:</strong> Menolak pemrosesan data Anda untuk tujuan tertentu
                                </li>
                                <li>
                                    <strong>Penarikan Persetujuan:</strong> Menarik persetujuan yang sebelumnya diberikan kapan saja
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-4">Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak yang tersedia di bagian akhir kebijakan ini.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>6. Cookie dan Teknologi Pelacakan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">Kami menggunakan cookie dan teknologi pelacakan serupa untuk:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>
                                    <strong>Cookie Esensial:</strong> Diperlukan untuk fungsi dasar platform (misalnya, autentikasi, keamanan)
                                </li>
                                <li>
                                    <strong>Cookie Fungsional:</strong> Mengingat preferensi Anda (misalnya, bahasa, tema)
                                </li>
                                <li>
                                    <strong>Cookie Analitik:</strong> Memahami bagaimana pengguna berinteraksi dengan platform kami
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-4">Anda dapat mengontrol pengaturan cookie melalui browser Anda. Namun, menonaktifkan cookie tertentu dapat mempengaruhi fungsionalitas platform.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>7. Privasi Anak-Anak</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Platform kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali dan
                                mengetahui bahwa anak Anda telah memberikan data pribadi kepada kami, silakan hubungi kami. Jika kami mengetahui bahwa kami telah mengumpulkan data pribadi dari anak di bawah 13 tahun tanpa verifikasi
                                persetujuan orang tua, kami akan mengambil langkah untuk menghapus informasi tersebut.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>8. Transfer Data Internasional</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Data Anda mungkin ditransfer dan disimpan di server yang berlokasi di luar Indonesia. Kami memastikan bahwa transfer data internasional dilakukan sesuai dengan hukum perlindungan data yang berlaku dan dengan
                                perlindungan yang memadai, seperti klausul kontrak standar atau mekanisme lain yang disetujui.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>9. Tautan ke Situs Pihak Ketiga</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Platform kami mungkin berisi tautan ke situs web atau layanan pihak ketiga. Kami tidak bertanggung jawab atas praktik privasi atau konten situs tersebut. Kami mendorong Anda untuk membaca kebijakan privasi
                                dari setiap situs web atau layanan pihak ketiga yang Anda kunjungi.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>10. Perubahan pada Kebijakan Privasi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami atau untuk alasan hukum, operasional, atau peraturan lainnya. Kami akan memberi tahu Anda
                                tentang perubahan signifikan dengan memposting kebijakan yang diperbarui di platform kami dan memperbarui tanggal "Terakhir diperbarui" di bagian atas halaman ini. Kami mendorong Anda untuk meninjau Kebijakan
                                Privasi ini secara berkala.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>11. Dasar Hukum Pemrosesan (untuk Pengguna EEA)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-3">Jika Anda berada di Wilayah Ekonomi Eropa (EEA), kami memproses data pribadi Anda berdasarkan:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>
                                    <strong>Persetujuan:</strong> Anda telah memberikan persetujuan untuk pemrosesan data untuk tujuan tertentu
                                </li>
                                <li>
                                    <strong>Kontrak:</strong> Pemrosesan diperlukan untuk pelaksanaan kontrak dengan Anda
                                </li>
                                <li>
                                    <strong>Kepentingan Sah:</strong> Pemrosesan diperlukan untuk kepentingan sah kami yang tidak dikesampingkan oleh hak privasi Anda
                                </li>
                                <li>
                                    <strong>Kewajiban Hukum:</strong> Pemrosesan diperlukan untuk mematuhi kewajiban hukum
                                </li>
                            </ul>
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
                            <p className="text-muted-foreground mb-4">Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami:</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <strong>Email:</strong> privacy@sapulidi.com atau info@sapulidi.com
                                </li>
                                <li>
                                    <strong>Telepon:</strong> +62 823-4616-1609
                                </li>
                                <li>
                                    <strong>Alamat:</strong> Ternate, Indonesia
                                </li>
                            </ul>
                            <p className="text-muted-foreground mt-4">Kami akan merespons permintaan Anda dalam waktu 30 hari atau sesuai dengan yang diwajibkan oleh hukum yang berlaku.</p>
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

export default PrivacyPolicy;
