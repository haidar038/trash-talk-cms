import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@/index.css";

const EditGalleryItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mediaType, setMediaType] = useState<"image" | "video">("image");
    const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape">("portrait");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: galleryItem, isLoading } = useQuery({
        queryKey: ["gallery-item", id],
        queryFn: async () => {
            const { data, error } = await supabase.from("gallery").select("*").eq("id", id).single();

            if (error) throw error;
            return data;
        },
    });

    useEffect(() => {
        if (galleryItem) {
            setTitle(galleryItem.title);
            setDescription(galleryItem.description || "");
            setMediaType(galleryItem.media_type);
            setAspectRatio(galleryItem.aspect_ratio);
        }
    }, [galleryItem]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("User not authenticated");
            if (!galleryItem) throw new Error("Gallery item not found");

            setIsUploading(true);

            let mediaUrl = galleryItem.media_url;
            let thumbnailUrl = galleryItem.thumbnail_url;

            // Upload new media if provided
            if (mediaFile) {
                const mediaFileName = `${user.id}/${Date.now()}-${mediaFile.name}`;
                const { data: mediaData, error: mediaError } = await supabase.storage
                    .from("gallery")
                    .upload(mediaFileName, mediaFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (mediaError) throw mediaError;

                const { data: mediaUrlData } = supabase.storage.from("gallery").getPublicUrl(mediaData.path);
                mediaUrl = mediaUrlData.publicUrl;
            }

            // Upload new thumbnail if provided
            if (thumbnailFile) {
                const thumbnailFileName = `${user.id}/${Date.now()}-thumb-${thumbnailFile.name}`;
                const { data: thumbData, error: thumbError } = await supabase.storage
                    .from("gallery")
                    .upload(thumbnailFileName, thumbnailFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (thumbError) throw thumbError;

                const { data: thumbUrlData } = supabase.storage.from("gallery").getPublicUrl(thumbData.path);
                thumbnailUrl = thumbUrlData.publicUrl;
            }

            // Update gallery record
            const { error: dbError } = await supabase
                .from("gallery")
                .update({
                    title,
                    description,
                    media_url: mediaUrl,
                    thumbnail_url: thumbnailUrl,
                    media_type: mediaType,
                    aspect_ratio: aspectRatio,
                })
                .eq("id", id);

            if (dbError) throw dbError;
        },
        onSuccess: () => {
            toast.success("Gallery item updated successfully");
            navigate("/admin/gallery");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update gallery item");
            setIsUploading(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }
        updateMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
                <p className="text-lg">Loading gallery item...</p>
            </div>
        );
    }

    if (!galleryItem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">Gallery item not found</p>
                    <Button onClick={() => navigate("/admin/gallery")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Button variant="ghost" onClick={() => navigate("/admin/gallery")} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Gallery
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Gallery Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Media Type *</Label>
                                <RadioGroup value={mediaType} onValueChange={(value: any) => setMediaType(value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="image" id="image" />
                                        <Label htmlFor="image" className="cursor-pointer">
                                            Image - Photos, illustrations, graphics
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="video" id="video" />
                                        <Label htmlFor="video" className="cursor-pointer">
                                            Video - Video clips, animations
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Aspect Ratio *</Label>
                                <RadioGroup value={aspectRatio} onValueChange={(value: any) => setAspectRatio(value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="portrait" id="portrait" />
                                        <Label htmlFor="portrait" className="cursor-pointer">
                                            Portrait (9:16) - Recommended for mobile content
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="landscape" id="landscape" />
                                        <Label htmlFor="landscape" className="cursor-pointer">
                                            Landscape (16:9) - Standard format
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Current Media</Label>
                                {galleryItem.media_type === "video" ? (
                                    <video src={galleryItem.media_url} controls className="w-full max-h-64 bg-black rounded" />
                                ) : (
                                    <img src={galleryItem.media_url} alt={galleryItem.title} className="w-full max-h-64 object-contain rounded" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="media">Replace Media (Optional)</Label>
                                <Input
                                    id="media"
                                    type="file"
                                    accept={mediaType === "image" ? "image/*" : "video/*"}
                                    onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                                />
                                {mediaFile && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: {mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>

                            {mediaType === "video" && (
                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail">Replace Thumbnail (Optional)</Label>
                                    {galleryItem.thumbnail_url && (
                                        <img
                                            src={galleryItem.thumbnail_url}
                                            alt="Current thumbnail"
                                            className="w-32 h-32 object-cover rounded mb-2"
                                        />
                                    )}
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                    />
                                    {thumbnailFile && (
                                        <p className="text-sm text-muted-foreground">Selected: {thumbnailFile.name}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button type="submit" disabled={isUploading} className="flex-1">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Update
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin/gallery")}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EditGalleryItem;
