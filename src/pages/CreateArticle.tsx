import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";

const CATEGORIES = ["Recycling", "Composting", "Waste Reduction", "E-Waste", "Hazardous Waste", "Industrial Waste", "Zero Waste", "Sustainability"];

const CreateArticle = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate("/auth");
            }
        });
    }, [navigate]);

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
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Konten Tiptap yang kosong bisa berupa string kosong atau '<p></p>'
        if (content.trim() === "" || content.trim() === "<p></p>") {
            toast.error("Article content is required.");
            return;
        }

        setIsLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in to create articles");
                navigate("/auth");
                return;
            }

            let imageUrl = null;

            // Upload image if one is selected
            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from("article-images").upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from("article-images").getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            const { error } = await supabase.from("articles").insert([
                {
                    title,
                    content, // 'content' sekarang berisi HTML dari Tiptap
                    category,
                    image_url: imageUrl,
                    user_id: user.id,
                },
            ]);

            if (error) throw error;

            toast.success("Artikel berhasil dibuat!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Gagal untuk membuat artikel");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
            <div className="container mx-auto max-w-3xl py-8">
                <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Button>

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl">Create New Article</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Enter article title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Article Image (Optional)</Label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                        <label className="cursor-pointer">
                                            <span className="text-sm text-primary hover:underline">Click to upload an image</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <RichTextEditor initialContent={content} onChange={setContent} disabled={isLoading} />
                            </div>

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading} className="flex-1">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Article"
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

export default CreateArticle;
