import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const Articles = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: articles, isLoading } = useQuery({
        queryKey: ["public-articles"],
        queryFn: async () => {
            const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const filteredArticles = articles?.filter(
        (article) => article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.content.toLowerCase().includes(searchQuery.toLowerCase()) || article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">All Articles</h1>
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>
                    </div>

                    {isLoading ? (
                        <p>Loading articles...</p>
                    ) : filteredArticles && filteredArticles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/article/${article.id}`)}>
                                    {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />}
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 mb-1">{article.title}</CardTitle>
                                        <CardDescription className="flex row justify-between">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(article.created_at), "MMM dd, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Tag className="h-3 w-3" />
                                                {article.category}
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">{searchQuery ? "No articles found matching your search." : "No articles yet."}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Articles;
