import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Calendar, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import "@/index.css";

interface GalleryItem {
    id: string;
    title: string;
    description: string;
    media_url: string;
    thumbnail_url: string;
    media_type: "image" | "video";
    aspect_ratio: "portrait" | "landscape";
    views: number;
    created_at: string;
}

const ManageGallery = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<"all" | "image" | "video">("all");

    const { data: galleryItems, isLoading } = useQuery({
        queryKey: ["admin-gallery"],
        queryFn: async () => {
            const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });

            if (error) throw error;
            return data as GalleryItem[];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (itemId: string) => {
            const { error } = await supabase.from("gallery").delete().eq("id", itemId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
            toast.success("Item galeri telah dihapus dengan sukses.");
        },
        onError: () => {
            toast.error("Gagal menghapus item galeri");
        },
    });

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const filteredItems = galleryItems?.filter((item) => {
        if (filter === "all") return true;
        return item.media_type === filter;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
                <p className="text-lg">Memuat galeri...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Kelola Galero</h1>
                        <p className="text-muted-foreground">Buat, edit, dan hapus item galeri</p>
                    </div>
                    <Button onClick={() => navigate("/admin/gallery/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Item Baru
                    </Button>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                    <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                        Semua ({galleryItems?.length || 0})
                    </Button>
                    <Button variant={filter === "image" ? "default" : "outline"} size="sm" onClick={() => setFilter("image")}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Gambar ({galleryItems?.filter((i) => i.media_type === "image").length || 0})
                    </Button>
                    <Button variant={filter === "video" ? "default" : "outline"} size="sm" onClick={() => setFilter("video")}>
                        <VideoIcon className="h-4 w-4 mr-2" />
                        Video ({galleryItems?.filter((i) => i.media_type === "video").length || 0})
                    </Button>
                </div>

                {filteredItems && filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <div className="relative bg-black">
                                    {item.thumbnail_url || item.media_type === "image" ? (
                                        <img src={item.thumbnail_url || item.media_url} alt={item.title} className="w-full aspect-square object-cover" />
                                    ) : (
                                        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                            {item.media_type === "video" ? <VideoIcon className="h-16 w-16 text-muted-foreground" /> : <ImageIcon className="h-16 w-16 text-muted-foreground" />}
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 left-2" variant="secondary">
                                        {item.media_type === "video" ? <VideoIcon className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                                        {item.media_type}
                                    </Badge>
                                    <Badge className="absolute top-2 right-2" variant="secondary">
                                        {item.aspect_ratio === "portrait" ? "9:16" : "16:9"}
                                    </Badge>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                                    {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(item.created_at), "MMM dd, yyyy")}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {item.views} lihat
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/admin/gallery/edit/${item.id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(item.id, item.title)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Belum ada item galeri</h3>
                            <p className="text-muted-foreground mb-4">{filter === "all" ? "Get started by creating your first gallery item" : `No ${filter}s found. Try adding some!`}</p>
                            <Button onClick={() => navigate("/admin/gallery/create")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Item Galeri
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ManageGallery;
