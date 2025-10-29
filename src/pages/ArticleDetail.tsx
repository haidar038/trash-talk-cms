import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import "@/index.css";

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();

            if (error) throw error;
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center">
                <p className="text-lg">Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex flex-col items-center justify-center gap-4">
                <p className="text-lg">Article not found</p>
                <Button onClick={() => navigate("/articles")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Articles
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => navigate("/articles")} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Articles
                </Button>

                <article className="max-w-4xl mx-auto bg-card rounded-lg border border-border overflow-hidden">
                    {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-96 object-cover" />}

                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <Badge variant="outline">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(article.created_at), "MMM dd, yyyy")}
                                </div>
                            </Badge>
                            <Badge variant="outline">
                                <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    {article.category}
                                </div>
                            </Badge>
                        </div>

                        <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ArticleDetail;
