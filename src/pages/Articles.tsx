import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const Articles = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const { user, isAdmin } = useAuth();

    const { data: articles, isLoading } = useQuery({
        queryKey: ["public-articles"],
        queryFn: async () => {
            const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const filteredArticles = articles
        ?.map((article) => ({
            ...article,
            // Buat versi plain text dari konten untuk pencarian dan preview
            // Ganti semua tag HTML dengan spasi
            plainContent: article.content.replace(/<[^>]+>/g, " ") || "",
        }))
        .filter(
            (article) =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // Gunakan plainContent untuk pencarian
                article.plainContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4 sm:mb-5 md:mb-6">
                        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Back to Home</span>
                    </Button>

                    <div className="mb-6 sm:mb-7 md:mb-8 flex flex-col lg:flex-row justify-between gap-4 lg:gap-6 lg:items-end">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">All Articles</h1>
                            <div className="relative w-full sm:max-w-sm md:max-w-md">
                                <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
                                />
                            </div>
                        </div>
                        {user && (
                            <>
                                {isAdmin && (
                                    <div className="lg:mt-0">
                                        <Button onClick={() => navigate("/create")} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            Buat Artikel
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {isLoading ? (
                        <p className="text-sm sm:text-base">Loading articles...</p>
                    ) : filteredArticles && filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {filteredArticles.map((article) => (
                                <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/article/${article.id}`)}>
                                    {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-36 sm:h-40 md:h-48 object-cover rounded-t-lg" />}
                                    <CardHeader className="p-3 sm:p-4 md:p-6">
                                        <CardTitle className="line-clamp-2 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">{article.title}</CardTitle>
                                        <CardDescription className="flex row justify-between gap-2">
                                            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
                                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                <span className="truncate">{format(new Date(article.created_at), "MMM dd, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
                                                <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                <span className="truncate">{article.category}</span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                                        {/* Gunakan plainContent untuk preview */}
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{article.plainContent}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6">
                                <p className="text-center text-muted-foreground text-xs sm:text-sm md:text-base">{searchQuery ? "No articles found matching your search." : "No articles yet."}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Articles;
