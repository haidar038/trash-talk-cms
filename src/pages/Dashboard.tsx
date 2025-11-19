import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Loader2, Plus, LogOut, Recycle, Edit, Trash2, Search } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
    updated_at: string;
}

interface ArticleWithPlainText extends Article {
    plainContent: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate("/auth");
            } else {
                setUser(session.user);
                fetchArticles();
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                navigate("/auth");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error: any) {
            toast.error("Failed to load articles");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleSignOut = async () => {
    //     await supabase.auth.signOut();
    //     toast.success("Signed out successfully");
    //     navigate("/auth");
    // };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase.from("articles").delete().eq("id", deleteId);

            if (error) throw error;

            toast.success("Article deleted successfully");
            setArticles(articles.filter((a) => a.id !== deleteId));
            setDeleteId(null);
        } catch (error: any) {
            toast.error("Failed to delete article");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredArticles: ArticleWithPlainText[] = articles
        .map((article) => ({
            ...article,
            // Buat versi plain text dari konten untuk pencarian dan preview
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
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
            <main className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="mb-6 sm:mb-7 md:mb-8 flex flex-col lg:flex-row justify-between gap-4 lg:gap-6 lg:items-end">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Artikel Anda</h2>
                        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Kelola artikel edukasi tentang pengolahan sampah</p>
                        <div className="relative w-full sm:max-w-sm md:max-w-md">
                            <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search your articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
                            />
                        </div>
                    </div>
                    <div className="lg:mt-0">
                        <Button onClick={() => navigate("/create")} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Buat Artikel
                        </Button>
                    </div>
                </div>

                {filteredArticles.length === 0 ? (
                    <Card className="text-center py-8 sm:py-10 md:py-12">
                        <CardContent>
                            <Recycle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                            <CardTitle className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl">Tidak ada artikel yang ditemukan</CardTitle>
                            <CardDescription className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">{searchQuery ? "No articles match your search." : "Create your first article to get started"}</CardDescription>
                            <Button onClick={() => navigate("/create")} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Buat Artikel
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                        {filteredArticles.map((article) => (
                            <Card key={article.id} className="hover:shadow-lg transition-shadow w-full max-w-xl mx-auto">
                                <CardHeader className="p-4 sm:p-5 md:p-6">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="truncate text-base sm:text-lg md:text-xl">{article.title}</CardTitle>
                                            <CardDescription className="mt-1 text-xs sm:text-sm">{article.category}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3 sm:mb-4">{article.plainContent}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <Button size="sm" variant="outline" onClick={() => navigate(`/edit/${article.id}`)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setDeleteId(article.id)} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg md:text-xl">Hapus Artikel</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm md:text-base">Apakah anda yakin akan menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <AlertDialogCancel className="text-xs sm:text-sm w-full sm:w-auto">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="text-xs sm:text-sm w-full sm:w-auto">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Dashboard;
