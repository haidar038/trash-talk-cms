import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon, AlertCircle, PieChart } from "lucide-react";
import { toast } from "sonner";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

interface WasteType {
    name: string;
    category: string;
    percentage: number;
    recyclable: boolean;
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        setError("");
        setResults(null);
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageDataUrl(e.target?.result as string);
        };
        reader.onerror = () => {
            setError("Failed to read file. Please try again.");
        };
        reader.readAsDataURL(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleFile(file);
        } else {
            toast.error("Please upload an image file");
        }
    };

    const analyzeImage = async () => {
        if (!selectedFile || !imageDataUrl) return;
        setLoading(true);
        setError("");
        setResults(null);

        try {
            const prompt = `Analisa gambar ini dan identifikasi jenis sampah yang terlihat.
            
    Berikan respons dalam format JSON dengan struktur berikut:
    {
    "waste_types": [
        {
        "name": "nama jenis sampah",
        "category": "organik/anorganik/B3/elektronik",
        "percentage": estimasi persentase komposisi (angka saja),
        "recyclable": true/false,
        "decomposition_time": "waktu penguraian estimasi",
        "materials": [
            {
            "type": "jenis material (contoh: plastik, kertas, metal, kaca, organik, tekstil)",
            "percentage": estimasi persentase material (angka saja)
            }
        ]
        }
    ],
    "overall_assessment": "penilaian keseluruhan kondisi sampah",
    "disposal_recommendations": ["rekomendasi pengelolaan 1", "rekomendasi 2", "rekomendasi 3"],
    "environmental_impact": "dampak lingkungan jika tidak dikelola dengan baik"
    }

    PENTING:
    - Jika tidak ada sampah yang terdeteksi dalam gambar, return: {"error": "Tidak terdeteksi sampah dalam gambar", "waste_types": []}
    - Respons HARUS dalam format JSON yang valid
    - Jangan tambahkan teks apapun di luar JSON
    - Persentase harus total 100% untuk semua waste_types
    - Persentase materials dalam setiap waste_type harus total 100%`;

            if (!window.puter?.ai) {
                throw new Error("Puter.js is not available. Please ensure the script is loaded.");
            }

            const response = await window.puter.ai.chat(prompt, imageDataUrl, { model: "gpt-5-nano" });
            let resultText = response;
            if (response?.message?.content) resultText = response.message.content;
            else if (response?.content) resultText = response.content;

            if (typeof resultText === "string") {
                if (resultText.includes("```json")) {
                    resultText = resultText.split("```json")[1].split("```")[0].trim();
                } else if (resultText.includes("```")) {
                    resultText = resultText.split("```")[1].split("```")[0].trim();
                }
            }

            const data: AnalysisResult = typeof resultText === "string" ? JSON.parse(resultText) : resultText;
            setResults(data);

            if (data.error) {
                setError(data.error);
            }
        } catch (err: any) {
            console.error(err);
            setError("Error analyzing image: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    const getCategoryClass = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes("organic")) return "bg-green-100 text-green-800";
        if (cat.includes("hazardous")) return "bg-red-100 text-red-800";
        if (cat.includes("electronic")) return "bg-purple-100 text-purple-800";
        return "bg-blue-100 text-blue-800";
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">🌱 Klasifikasi Sampah dengan AI</h1>
                <p className="text-xl text-muted-foreground mb-2">Unggah gambar limbah untuk identifikasi otomatis menggunakan kecerdasan buatan (AI).</p>
                <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">⚡ Powered by Puter.js + OpenAI GPT-5-Nano</span>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imageDataUrl ? (
                            <div className="space-y-4">
                                <img src={imageDataUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        analyzeImage();
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mengidentifikasi...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="mr-2 h-4 w-4" />
                                            Identifikasi Gambar
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Click or Drag & Drop Image</h3>
                                <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, GIF, WEBP (Max 16MB)</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Card className="mb-8 border-destructive">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {results && !error && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">📊 Hasil Identifikasi</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Waste Information */}
                        <div className="space-y-6">
                            {results.waste_types.map((waste, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-semibold mb-4">{waste.name}</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${getCategoryClass(waste.category)}`}>{waste.category}</span>
                                            <span className={`px-3 py-1 rounded-full text-sm ${waste.recyclable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {waste.recyclable ? "♻️ Dapat didaur ulang" : "🚫 Tidak dapat didaur ulang"}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">📊 {waste.percentage}% yakin</span>
                                        </div>
                                        <p className="text-muted-foreground">⏱️ Waktu Penguraian: {waste.decomposition_time}</p>

                                        {waste.materials && waste.materials.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-lg font-semibold mb-2">🔍 Rincian Material:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                    {waste.materials.map((material, idx) => (
                                                        <li key={idx}>
                                                            {material.type}: {material.percentage}%
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {results.overall_assessment && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-semibold mb-2">📝 Penilaian Umum</h3>
                                        <p className="text-muted-foreground">{results.overall_assessment}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {results.environmental_impact && (
                                <Card className="border-l-4 border-l-warning">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-semibold mb-2">🌍 Dampak Lingkungan</h3>
                                        <p className="text-muted-foreground">{results.environmental_impact}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {results.disposal_recommendations && results.disposal_recommendations.length > 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-semibold mb-4">💡 Rekomendasi Pembuangan</h3>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Komposisi Sampah</h3>
                                    <div className="w-full max-w-[400px] mx-auto">
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
