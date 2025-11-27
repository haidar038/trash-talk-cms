import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, ImageIcon, AlertCircle, Camera, X, Zap, History } from "lucide-react";
import { toast } from "sonner";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useClassificationHistory } from "@/hooks/use-classification-history";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface WasteType {
    name: string;
    category: string;
    percentage: number;
    recyclable: boolean;
    recycle_reason: string;
    decomposition_time: string;
    materials: { type: string; percentage: number }[];
}

interface AnalysisResult {
    waste_types: WasteType[];
    overall_assessment: string;
    disposal_recommendations: string[];
    environmental_impact: string;
    error?: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Classification = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);
    const [isFlashlightSupported, setIsFlashlightSupported] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, loading: authLoading } = useAuth();
    const { saveClassification } = useClassificationHistory(user?.id);

    // Redirect to auth if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            toast.error("Silakan login terlebih dahulu untuk menggunakan fitur klasifikasi");
            navigate("/auth");
        }
    }, [user, authLoading, navigate]);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Setup video stream when camera becomes active
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;

            const track = stream.getVideoTracks()[0];
            if (track) {
                const capabilities = track.getCapabilities();
                setIsFlashlightSupported(!!(capabilities as any).torch);
            }
        }
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });
            setStream(mediaStream);
            setIsCameraActive(true);
            setError("");
        } catch (err) {
            console.error("Error accessing camera: ", err);
            setError("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin akses kamera.");
            toast.error("Gagal mengakses kamera");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            setIsCameraActive(false);
            setIsFlashlightOn(false);
            setIsFlashlightSupported(false);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const toggleFlashlight = async () => {
        if (stream && isFlashlightSupported) {
            const track = stream.getVideoTracks()[0];
            try {
                await track.applyConstraints({
                    advanced: [{ torch: !isFlashlightOn }],
                } as any);
                setIsFlashlightOn(!isFlashlightOn);
            } catch (err) {
                console.error("Error toggling flashlight: ", err);
                toast.error("Gagal menyalakan senter");
            }
        }
    };

    const captureImage = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1024;
            const MAX_HEIGHT = 1024;
            let width = videoRef.current.videoWidth;
            let height = videoRef.current.videoHeight;

            // Resize if needed
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, width, height);
                // Use JPEG with 80% quality for smaller file size
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                setImageDataUrl(dataUrl);
                console.log("Captured image size:", Math.round(dataUrl.length / 1024), "KB");
                fetch(dataUrl)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                        setSelectedFile(file);
                    });
                stopCamera();
                toast.success("Gambar berhasil diambil");
            }
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 80% quality
                    const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFile = async (file: File) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Mohon unggah file gambar");
            return;
        }

        setError("");
        setResults(null);
        setSelectedFile(file);

        try {
            const compressedImage = await compressImage(file);
            setImageDataUrl(compressedImage);
            console.log("Image compressed. Size:", Math.round(compressedImage.length / 1024), "KB");
        } catch (err) {
            console.error("Compression error:", err);
            setError("Gagal memproses gambar. Silakan coba lagi.");
            toast.error("Gagal memproses gambar");
        }
    };

    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleFile(file);
        } else {
            toast.error("Mohon unggah file gambar");
        }
    };

    const analyzeImage = async () => {
        if (!selectedFile || !imageDataUrl) return;
        setLoading(true);
        setError("");
        setResults(null);

        try {
            // Get current session
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("Anda harus login terlebih dahulu");
            }

            console.log("Sending image to Edge Function...");
            console.log("Image size:", Math.round(imageDataUrl.length / 1024), "KB");

            // Call Supabase Edge Function with timeout (90 seconds)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Request timeout - Proses terlalu lama. Coba dengan gambar yang lebih kecil.")), 90000);
            });

            const functionPromise = supabase.functions.invoke("classify-waste", {
                body: { imageDataUrl },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            const { data, error: functionError } = (await Promise.race([functionPromise, timeoutPromise])) as any;

            if (functionError) {
                console.error("Function Error Details:", {
                    message: functionError.message,
                    context: functionError.context,
                    details: data,
                });
                throw new Error(data?.error || functionError.message || "Edge Function error");
            }

            const result: AnalysisResult = data;
            setResults(result);

            if (result.error) {
                setError(result.error);
                toast.error(result.error);
            } else {
                toast.success("Analisis berhasil!");

                // Save to history
                if (user?.id) {
                    const avgPercentage = result.waste_types.reduce((sum, w) => sum + w.percentage, 0) / result.waste_types.length;

                    saveClassification.mutate({
                        user_id: user.id,
                        image_url: imageDataUrl,
                        result: result,
                        accuracy: avgPercentage / 100, // Convert percentage to 0-1 range
                    });
                }
            }
        } catch (err: any) {
            console.error("Classification Error:", err);
            const errorMsg = "Error menganalisis gambar: " + (err.message || err);
            setError(errorMsg);
            toast.error("Gagal menganalisis gambar");
        } finally {
            setLoading(false);
        }
    };

    const resetUpload = () => {
        setImageDataUrl(null);
        setSelectedFile(null);
        setResults(null);
        setError("");
    };

    const getCategoryClass = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes("organik")) return "bg-green-100 text-green-800";
        if (cat.includes("b3") || cat.includes("hazardous")) return "bg-red-100 text-red-800";
        if (cat.includes("elektronik")) return "bg-purple-100 text-purple-800";
        return "bg-blue-100 text-blue-800";
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-3xl md:max-w-4xl lg:max-w-5xl">
            <div className="text-center mb-6 sm:mb-7 md:mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">🌱 Klasifikasi Sampah dengan AI</h1>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-2 sm:mb-3 px-4">Unggah gambar limbah untuk identifikasi otomatis menggunakan kecerdasan buatan (AI).</p>
                <span className="inline-block bg-primary/10 text-primary text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">⚡ Powered by Groq (Llama 4 Scout)</span>
            </div>

            {user && (
                <Button variant="outline" size="sm" onClick={() => navigate("/classification/history")} className="text-xs sm:text-sm mb-3">
                    <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1" />
                    <span className="hidden sm:inline">Lihat </span>Riwayat
                </Button>
            )}

            <Card className="mb-6 sm:mb-7 md:mb-8">
                <CardContent className="pt-4 sm:pt-5 md:pt-6">
                    <div
                        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-all duration-200 ${
                            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                    >
                        {imageDataUrl ? (
                            <div className="space-y-3 sm:space-y-4">
                                <img src={imageDataUrl} alt="Preview" className="max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-80 mx-auto rounded-lg shadow-md" />
                                <div className="flex flex-col sm:flex-row justify-center gap-2">
                                    <Button onClick={analyzeImage} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                                <span className="text-xs sm:text-sm">Mengidentifikasi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="text-xs sm:text-sm">Identifikasi Gambar</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={resetUpload} className="w-full sm:w-auto text-sm sm:text-base">
                                        <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="text-xs sm:text-sm">Hapus</span>
                                    </Button>
                                </div>
                            </div>
                        ) : isCameraActive ? (
                            <div className="space-y-3 sm:space-y-4">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-64 sm:max-h-80 md:max-h-96 rounded-lg shadow-md bg-black" />
                                <div className="flex flex-col sm:flex-row justify-center gap-2">
                                    <Button onClick={captureImage} className="w-full sm:w-auto text-xs sm:text-sm">
                                        <Camera className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Ambil Gambar
                                    </Button>
                                    {isFlashlightSupported && (
                                        <Button variant="outline" onClick={toggleFlashlight} className="w-full sm:w-auto text-xs sm:text-sm">
                                            <Zap className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isFlashlightOn ? "text-yellow-400" : ""}`} />
                                            <span className="hidden sm:inline">{isFlashlightOn ? "Matikan" : "Nyalakan"} </span>Senter
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={stopCamera} className="w-full sm:w-auto text-xs sm:text-sm">
                                        <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Batal
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex flex-col sm:flex-row justify-center gap-2">
                                    <Button className="w-full sm:flex-1 sm:max-w-xs text-xs sm:text-sm" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Unggah Gambar
                                    </Button>
                                    <Button className="w-full sm:flex-1 sm:max-w-xs text-xs sm:text-sm" variant="outline" onClick={startCamera}>
                                        <Camera className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Buka Kamera
                                    </Button>
                                </div>
                                <p className={`text-xs sm:text-sm transition-colors ${isDragging ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                                    {isDragging ? "📂 Lepaskan gambar di sini" : "Atau seret & lepas gambar di sini"}
                                </p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Card className="mb-6 sm:mb-7 md:mb-8 border-destructive">
                    <CardContent className="pt-4 sm:pt-5 md:pt-6">
                        <div className="flex items-start sm:items-center gap-2 text-destructive text-sm sm:text-base">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {results && !error && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">📊 Hasil Identifikasi</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                        {/* Left Column - Waste Information */}
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            {results.waste_types.map((waste, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-4 sm:pt-5 md:pt-6">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 first-letter:uppercase">{waste.name}</h3>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${getCategoryClass(waste.category)}`}>{waste.category}</span>
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${waste.recyclable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {waste.recyclable ? "♻️ " : "🚫 "}
                                                <span className="hidden sm:inline">{waste.recyclable ? "Dapat didaur ulang" : "Tidak dapat didaur ulang"}</span>
                                                <span className="sm:hidden">Daur ulang</span>
                                            </span>
                                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800">📊 {waste.percentage}%</span>
                                        </div>
                                        <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                                            <strong>⚠ Catatan Daur Ulang:</strong> <span className="inline-block text-muted-foreground first-letter:uppercase">{waste.recycle_reason}</span>
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            <strong>⏱️ Waktu Penguraian:</strong> <span className="inline-block text-muted-foreground first-letter:uppercase">{waste.decomposition_time}</span>
                                        </p>

                                        {waste.materials && waste.materials.length > 0 && (
                                            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                                                <p className="font-bold text-sm sm:text-base">🔍 Rincian Material:</p>
                                                <Badge variant="outline" className="text-xs sm:text-sm">
                                                    {waste.materials.map((material, idx) => (
                                                        <div key={idx} className="capitalize">
                                                            {material.type}: {material.percentage}%
                                                        </div>
                                                    ))}
                                                </Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {results.overall_assessment && (
                                <Card>
                                    <CardContent className="pt-4 sm:pt-5 md:pt-6">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">📝 Penilaian Umum</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">{results.overall_assessment}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {results.environmental_impact && (
                                <Card className="border-l-4 border-l-yellow-500">
                                    <CardContent className="pt-4 sm:pt-5 md:pt-6">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">🌍 Dampak Lingkungan</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">{results.environmental_impact}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {results.disposal_recommendations && results.disposal_recommendations.length > 0 && (
                                <Card>
                                    <CardContent className="pt-4 sm:pt-5 md:pt-6">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">💡 Rekomendasi Pembuangan</h3>
                                        <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-muted-foreground text-sm sm:text-base">
                                            {results.disposal_recommendations.map((rec, index) => (
                                                <li key={index}>{rec}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Chart */}
                        <div className="lg:sticky lg:top-6 h-fit">
                            <Card>
                                <CardContent className="pt-4 sm:pt-5 md:pt-6">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">📈 Komposisi Sampah</h3>
                                    <div className="w-full max-w-[300px] sm:max-w-[400px] mx-auto">
                                        <Pie
                                            data={{
                                                labels: results.waste_types.map((w) => w.name),
                                                datasets: [
                                                    {
                                                        data: results.waste_types.map((w) => w.percentage),
                                                        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(153, 102, 255, 0.5)", "rgba(255, 159, 64, 0.5)"],
                                                        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        position: "bottom",
                                                    },
                                                },
                                                maintainAspectRatio: true,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Classification;
