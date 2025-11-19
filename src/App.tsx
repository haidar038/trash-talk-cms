import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PuterProvider from "@/components/PuterProvider";
import Layout from "@/components/Layout";
import WithRoleCheck from "@/components/WithRoleCheck";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Gallery from "./pages/Gallery";
import ManageGallery from "./pages/ManageGallery";
import CreateGalleryItem from "./pages/CreateGalleryItem";
import EditGalleryItem from "./pages/EditGalleryItem";
import Classification from "./pages/Classification";
import ChatBot from "./pages/ChatBot";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import ClassificationHistory from "./pages/ClassificationHistory";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <PuterProvider />
            <Toaster />
            <Sonner />
            <CookieConsent />
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
                        <Route
                            path="/admin/gallery"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <ManageGallery />
                                </WithRoleCheck>
                            }
                        />
                        <Route
                            path="/admin/gallery/create"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <CreateGalleryItem />
                                </WithRoleCheck>
                            }
                        />
                        <Route
                            path="/admin/gallery/edit/:id"
                            element={
                                <WithRoleCheck requiredRole="admin">
                                    <EditGalleryItem />
                                </WithRoleCheck>
                            }
                        />

                        {/* Public Routes */}
                        <Route path="/about" element={<About />} />
                        <Route path="/articles" element={<Articles />} />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/classification" element={<Classification />} />
                        <Route path="/classification/history" element={<ClassificationHistory />} />
                        <Route path="/chatbot" element={<ChatBot />} />

                        {/* Profile Routes */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />

                        {/* Legal Routes */}
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
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
