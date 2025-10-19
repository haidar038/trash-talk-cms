import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Recycle, BookOpen, Leaf, ArrowRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Index = () => {
  const navigate = useNavigate();

  const { data: featuredArticles } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Recycle className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Waste Management
            <span className="block text-primary mt-2">Content Hub</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your comprehensive platform for managing articles, resources, and insights about waste management, recycling, and sustainability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="gap-2 text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/articles")}
              className="gap-2 text-lg px-8 py-6"
            >
              Browse Articles
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Article Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, and organize your waste management content efficiently
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Recycle className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Categorization</h3>
              <p className="text-sm text-muted-foreground">
                Sort by recycling, composting, e-waste, and more categories
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Leaf className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Sustainability Focus</h3>
              <p className="text-sm text-muted-foreground">
                Promote eco-friendly practices and zero waste initiatives
              </p>
            </div>
          </div>

          {featuredArticles && featuredArticles.length > 0 && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Featured Articles</h2>
                <Button variant="ghost" onClick={() => navigate("/articles")}>
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(article.created_at), "MMM dd, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
