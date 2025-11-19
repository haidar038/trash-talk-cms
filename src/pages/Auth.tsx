import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { toast } from "sonner";
import { Loader2, Recycle, Eye, EyeOff } from "lucide-react";

const Auth = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Generate username function
    const generateUsername = (email: string): string => {
        const baseUsername = email.split("@")[0];
        const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate 4 digit number
        return `${baseUsername}${randomNum}`;
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/dashboard");
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigate("/dashboard");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Generate username
            const generatedUsername = generateUsername(email);

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: generatedUsername,
                    },
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (error) throw error;
            toast.success("Account created successfully! Please check your email to verify your account.");
        } catch (error: any) {
            toast.error(error.message || "Failed to sign up");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            toast.success("Signed in successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 px-4 sm:px-6 py-6 sm:py-8">
            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl border-border/50">
                <CardHeader className="space-y-2 sm:space-y-3 text-center p-4 sm:p-5 md:p-6">
                    <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-1 sm:mb-2">
                        <img src="/SPL.png" alt="SapuLidi" className="max-h-8 sm:max-h-9 md:max-h-10 object-contain" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Sapu<span className="text-primary">Lidi</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base">Akses dan nikmati fitur lengkap SapuLidi</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6">
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                            <TabsTrigger value="signin" className="text-xs sm:text-sm">Masuk</TabsTrigger>
                            <TabsTrigger value="signup" className="text-xs sm:text-sm">Registrasi</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="signin-email" className="text-xs sm:text-sm">Email</Label>
                                    <Input id="signin-email" type="email" placeholder="budi@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="text-sm sm:text-base h-9 sm:h-10" />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="signin-password" className="text-xs sm:text-sm">Kata Sandi</Label>
                                    <div className="relative">
                                        <Input
                                            id="signin-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            minLength={6}
                                            className="pr-10 text-sm sm:text-base h-9 sm:h-10"
                                        />
                                        <button
                                            type="button"
                                            aria-label="Toggle password visibility"
                                            title="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full text-xs sm:text-sm h-9 sm:h-10 md:h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                            Sedang Masuk...
                                        </>
                                    ) : (
                                        "Masuk"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="signup-fullname" className="text-xs sm:text-sm">Nama Lengkap</Label>
                                    <Input id="signup-fullname" type="text" placeholder="Budi Santoso" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading} minLength={3} className="text-sm sm:text-base h-9 sm:h-10" />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="signup-email" className="text-xs sm:text-sm">Email</Label>
                                    <Input id="signup-email" type="email" placeholder="budi@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="text-sm sm:text-base h-9 sm:h-10" />
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">Username akan dibuat otomatis menggunakan bagian email sebelum @ dan 4 digit angka acak</p>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="signup-password" className="text-xs sm:text-sm">Kata Sandi</Label>
                                    <div className="relative">
                                        <Input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                            title="Password harus memiliki minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter khusus"
                                            className="pr-10 text-sm sm:text-base h-9 sm:h-10"
                                        />
                                        <button
                                            type="button"
                                            aria-label="Toggle password visibility"
                                            title="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full text-xs sm:text-sm h-9 sm:h-10 md:h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                            Membuat Akun...
                                        </>
                                    ) : (
                                        "Bergabung!"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                    <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
                        <Link to="/" className="underline text-muted-foreground hover:text-primary transition-colors">
                            Kembali ke halaman utama
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Auth;
