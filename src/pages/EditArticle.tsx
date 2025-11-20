import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Daur Ulang", "Pengomposan", "Pengurangan Sampah", "Sampah Elektronik", "Limbah Berbahaya", "Lombah Industri", "Zero Waste", "Keberlanjutan"];

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    navigate("/auth");
                    return;
                }

                const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();

                if (error) throw error;

                if (data.user_id !== session.user.id) {
                    toast.error("Anda tidak memiliki izin untuk mengedit artikel ini.");
                    navigate("/dashboard");
                    return;
                }

                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category);
                setCurrentImageUrl(data.image_url);
            } catch (error: any) {
                toast.error("Gagal untuk memuat artikel");
                navigate("/dashboard");
            } finally {
                setIsFetching(false);
            }
        };

        fetchArticle();
    }, [id, navigate]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setCurrentImageUrl(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = currentImageUrl;

            // Upload new image if one is selected
            if (imageFile) {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) throw new Error("Tidak terverifikasi");

                const fileExt = imageFile.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from("article-images").upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from("article-images").getPublicUrl(fileName);

                imageUrl = publicUrl;

                // Delete old image if it exists
                if (currentImageUrl) {
                    const oldFileName = currentImageUrl.split("/").pop();
                    if (oldFileName) {
                        await supabase.storage.from("article-images").remove([oldFileName]);
                    }
                }
            }

            const { error } = await supabase
                .from("articles")
                .update({
                    title,
                    content,
                    category,
                    image_url: imageUrl,
                })
                .eq("id", id);

            if (error) throw error;

            toast.success("Artikel berhasil diubah!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to update article");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            <div className="container mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl">
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4 sm:mb-5 md:mb-6">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Kembali ke Dashboard</span>
                </Button>

                <Card className="shadow-xl">
                    <CardHeader className="p-4 sm:p-5 md:p-6">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl">Edit Artikel</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 md:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="title" className="text-xs sm:text-sm">
                                    Judul
                                </Label>
                                <Input id="title" placeholder="Masukkan judul artikel" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} className="text-sm sm:text-base" />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="category" className="text-xs sm:text-sm">
                                    Kategori
                                </Label>
                                <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
                                    <SelectTrigger id="category" className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="text-sm sm:text-base">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-xs sm:text-sm">Gambar Artikel (Opsional)</Label>
                                {imagePreview || currentImageUrl ? (
                                    <div className="relative">
                                        <img src={imagePreview || currentImageUrl || ""} alt="Preview" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-7 w-7 sm:h-9 sm:w-9" onClick={handleRemoveImage}>
                                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-7 md:p-8 text-center hover:border-primary/50 transition-colors">
                                        <Upload className="mx-auto h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 text-muted-foreground mb-1.5 sm:mb-2" />
                                        <label className="cursor-pointer">
                                            <span className="text-xs sm:text-sm text-primary hover:underline">Klik untuk mengunggah sebuah gambar</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="content" className="text-xs sm:text-sm">
                                    Isi
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder="Ketik untuk menulis isi disini..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    rows={10}
                                    className="resize-none text-sm sm:text-base"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading} className="flex-1 text-xs sm:text-sm">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 text-xs sm:text-sm">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                            Mengubah...
                                        </>
                                    ) : (
                                        "Ubah Artikel"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EditArticle;
