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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
            <Card className="w-full max-w-md shadow-2xl border-border/50">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {/* <Recycle className="w-9 h-9 text-primary" /> */}
                        <img src="/SPL.png" alt="SapuLidi" className="max-h-10 object-contain" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Sapu<span className="text-primary">Lidi</span>
                    </CardTitle>
                    <CardDescription>Akses dan nikmati fitur lengkap SapuLidi</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Masuk</TabsTrigger>
                            <TabsTrigger value="signup">Registrasi</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email">Email</Label>
                                    <Input id="signin-email" type="email" placeholder="budi@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password">Kata Sandi</Label>
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
                                            className="pr-10" // ruang untuk tombol
                                        />
                                        <button
                                            type="button"
                                            aria-label="Toggle password visibility"
                                            title="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sedang Masuk...
                                        </>
                                    ) : (
                                        "Masuk"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-fullname">Nama Lengkap</Label>
                                    <Input id="signup-fullname" type="text" placeholder="Budi Santoso" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading} minLength={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input id="signup-email" type="email" placeholder="budi@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                    <p className="text-xs text-muted-foreground">Username akan dibuat otomatis menggunakan bagian email sebelum @ dan 4 digit angka acak</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Kata Sandi</Label>
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
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            aria-label="Toggle password visibility"
                                            title="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Membuat Akun...
                                        </>
                                    ) : (
                                        "Bergabung!"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                    <div className="mt-4 text-center text-sm">
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
