import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowUp, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import "@/index.css";

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();

            if (error) throw error;
            return data;
        },
    });

    const { data: relatedArticles } = useQuery({
        queryKey: ["relatedArticles", article?.category, id],
        queryFn: async () => {
            if (!article?.category) return [];

            const { data, error } = await supabase
                .from("articles")
                .select("id, title, category, image_url, created_at")
                .eq("category", article.category)
                .neq("id", id)
                .order("created_at", { ascending: false })
                .limit(3);

            if (error) throw error;
            return data || [];
        },
        enabled: !!article?.category,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center px-4">
                <p className="text-base sm:text-lg">Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4">
                <p className="text-base sm:text-lg">Article not found</p>
                <Button onClick={() => navigate("/articles")} size="sm">
                    <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Back to Articles</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <Button variant="ghost" size="sm" onClick={() => navigate("/articles")} className="mb-4 sm:mb-5 md:mb-6">
                    <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Back to Articles</span>
                </Button>

                <article className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto bg-card rounded-lg border border-border overflow-hidden">
                    {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" />}

                    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs sm:text-sm">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">{format(new Date(article.created_at), "MMM dd, yyyy")}</span>
                                    <span className="sm:hidden">{format(new Date(article.created_at), "MMM dd")}</span>
                                </div>
                            </Badge>
                            <Badge variant="outline" className="text-xs sm:text-sm">
                                <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {article.category}
                                </div>
                            </Badge>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">{article.title}</h1>

                        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none overflow-x-auto" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                </article>

                {relatedArticles && relatedArticles.length > 0 && (
                    <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto mt-8 sm:mt-10 md:mt-12">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {relatedArticles.map((related) => (
                                <Card
                                    key={related.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                                    onClick={() => navigate(`/article/${related.id}`)}
                                >
                                    {related.image_url && (
                                        <div className="h-32 sm:h-36 md:h-40 overflow-hidden">
                                            <img
                                                src={related.image_url}
                                                alt={related.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    )}
                                    <CardHeader className="p-3 sm:p-4">
                                        <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-2">{related.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 sm:p-4 pt-0">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                                <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                                {related.category}
                                            </Badge>
                                            <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
                                                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                <span className="hidden sm:inline">{format(new Date(related.created_at), "MMM dd, yyyy")}</span>
                                                <span className="sm:hidden">{format(new Date(related.created_at), "MMM dd")}</span>
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showScrollTop && (
                <Button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 shadow-lg z-50"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            )}
        </div>
    );
};

export default ArticleDetail;
