import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Eye, Image as ImageIcon, Video as VideoIcon, X } from "lucide-react";
import { format } from "date-fns";
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

const Gallery = () => {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [filter, setFilter] = useState<"all" | "image" | "video">("all");

    const { data: galleryItems, isLoading } = useQuery({
        queryKey: ["gallery"],
        queryFn: async () => {
            const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });

            if (error) throw error;
            return data as GalleryItem[];
        },
    });

    const handleItemClick = async (item: GalleryItem) => {
        setSelectedItem(item);

        // Increment view count
        await supabase
            .from("gallery")
            .update({ views: item.views + 1 })
            .eq("id", item.id);
    };

    const filteredItems = galleryItems?.filter((item) => {
        if (filter === "all") return true;
        return item.media_type === filter;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center px-4">
                <p className="text-base sm:text-lg">Memuat galeri...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="mb-6 sm:mb-7 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">Galeri Media</h1>
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Jelajahi koleksi gambar dan video kami</p>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")} className="text-xs sm:text-sm">
                            Semua Media
                        </Button>
                        <Button variant={filter === "image" ? "default" : "outline"} size="sm" onClick={() => setFilter("image")} className="text-xs sm:text-sm">
                            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Gambar
                        </Button>
                        <Button variant={filter === "video" ? "default" : "outline"} size="sm" onClick={() => setFilter("video")} className="text-xs sm:text-sm">
                            <VideoIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Video
                        </Button>
                    </div>
                </div>

                {filteredItems && filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all group overflow-hidden" onClick={() => handleItemClick(item)}>
                                <div className="relative overflow-hidden bg-black">
                                    {item.thumbnail_url || item.media_type === "image" ? (
                                        <img src={item.thumbnail_url || item.media_url} alt={item.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                            {item.media_type === "video" ? <Play className="h-16 w-16 text-muted-foreground" /> : <ImageIcon className="h-16 w-16 text-muted-foreground" />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        {item.media_type === "video" ? <Play className="h-16 w-16 text-white" fill="white" /> : <Eye className="h-16 w-16 text-white" />}
                                    </div>
                                    <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[10px] sm:text-xs" variant="secondary">
                                        {item.media_type === "video" ? <VideoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> : <ImageIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />}
                                        <span className="hidden sm:inline">{item.media_type}</span>
                                    </Badge>
                                    <Badge className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[10px] sm:text-xs" variant="secondary">
                                        {item.aspect_ratio === "portrait" ? "9:16" : "16:9"}
                                    </Badge>
                                </div>
                                <CardContent className="p-3 sm:p-4">
                                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">{item.title}</h3>
                                    {item.description && <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">{item.description}</p>}
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                                        <span className="flex items-center gap-0.5 sm:gap-1">
                                            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            <span className="hidden sm:inline">{format(new Date(item.created_at), "MMM dd, yyyy")}</span>
                                            <span className="sm:hidden">{format(new Date(item.created_at), "MMM dd")}</span>
                                        </span>
                                        <span className="flex items-center gap-0.5 sm:gap-1">
                                            <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            {item.views}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-14 md:py-16 px-4">
                        <ImageIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-muted-foreground mb-3 sm:mb-4" />
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center">{filter === "all" ? "No media available yet" : `No ${filter}s available yet`}</p>
                    </div>
                )}
            </div>

            {/* Media Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setSelectedItem(null)}>
                    <div className="bg-card rounded-lg max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white w-8 h-8 sm:w-10 sm:h-10" onClick={() => setSelectedItem(null)}>
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>

                        <div className="relative">
                            {selectedItem.media_type === "video" ? (
                                <video src={selectedItem.media_url} controls autoPlay className={`w-full ${selectedItem.aspect_ratio === "portrait" ? "max-h-[60vh] sm:max-h-[70vh] mx-auto" : "aspect-video"}`} />
                            ) : (
                                <img
                                    src={selectedItem.media_url}
                                    alt={selectedItem.title}
                                    className={`w-full object-contain ${selectedItem.aspect_ratio === "portrait" ? "max-h-[60vh] sm:max-h-[70vh] mx-auto" : "max-h-[60vh] sm:max-h-[70vh]"}`}
                                />
                            )}
                        </div>
                        <div className="p-4 sm:p-5 md:p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold pr-8 sm:pr-0">{selectedItem.title}</h2>
                                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                    <Badge variant="outline" className="text-xs sm:text-sm">
                                        {selectedItem.media_type === "video" ? <VideoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> : <ImageIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />}
                                        <span className="hidden sm:inline">{selectedItem.media_type}</span>
                                    </Badge>
                                    <Badge variant="outline" className="text-xs sm:text-sm">
                                        {selectedItem.aspect_ratio === "portrait" ? "9:16" : "16:9"}
                                    </Badge>
                                </div>
                            </div>
                            {selectedItem.description && <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">{selectedItem.description}</p>}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">{format(new Date(selectedItem.created_at), "MMM dd, yyyy")}</span>
                                    <span className="sm:hidden">{format(new Date(selectedItem.created_at), "MMM dd")}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {selectedItem.views + 1} views
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
