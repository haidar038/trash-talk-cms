import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PuterProvider from "@/components/PuterProvider";
import Layout from "@/components/Layout";
import WithRoleCheck from "@/components/WithRoleCheck";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Classification from "./pages/Classification";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import ClassificationHistory from "./pages/ClassificationHistory";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <PuterProvider />
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />

                        {/* Admin Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <Dashboard />
                                </WithRoleCheck>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <CreateArticle />
                                </WithRoleCheck>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <EditArticle />
                                </WithRoleCheck>
                            }
                        />

                        {/* Public Routes */}
                        <Route path="/articles" element={<Articles />} />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route path="/classification" element={<Classification />} />
                        <Route path="/classification/history" element={<ClassificationHistory />} />

                        {/* Profile Routes */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                    </Route>
                    <Route path="/auth" element={<Auth />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
