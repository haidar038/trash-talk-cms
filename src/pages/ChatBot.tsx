import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Send, Bot, User, Trash2, MessageSquare, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Message {
    id: string;
    message: string;
    response: string;
    created_at: string;
    isUser?: boolean;
}

const FREQUENTLY_ASKED_QUESTIONS = [
    "Apa saja jenis sampah yang bisa didaur ulang?",
    "Bagaimana cara memulai kompos di rumah?",
    "Apa itu sampah elektronik (e-waste)?",
    "Bagaimana cara memilah sampah dengan benar?",
    "Apa manfaat daur ulang bagi lingkungan?",
    "Bagaimana cara mengurangi sampah plastik?",
];

const ChatBot = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch chat history
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!user) {
                setIsFetchingHistory(false);
                return;
            }

            try {
                const { data, error } = await supabase.from("chat_history").select("*").eq("user_id", user.id).order("created_at", { ascending: true });

                if (error) throw error;
                setMessages(data || []);
            } catch (error: any) {
                toast.error("Gagal memuat riwayat chat");
            } finally {
                setIsFetchingHistory(false);
            }
        };

        fetchChatHistory();
    }, [user]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (messageText: string) => {
        if (!user) {
            toast.error("Silakan masuk untuk menggunakan chatbot");
            navigate("/auth");
            return;
        }

        setIsLoading(true);

        // Add user message to UI immediately
        const tempId = `temp-${Date.now()}`;
        const tempMessage: Message = {
            id: tempId,
            message: messageText,
            response: "",
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);

        try {
            // Initialize Gemini AI
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

            // System prompt to keep conversation on-topic about waste management
            const systemPrompt = `Anda adalah SapuLidi Assistant, chatbot yang membantu dan mengkhususkan diri dalam pengelolaan sampah, daur ulang, dan keberlanjutan lingkungan. Peran Anda adalah:

1. Menjawab pertanyaan tentang klasifikasi sampah, daur ulang, kompos, dan pengurangan sampah
2. Memberikan tips tentang pembuangan sampah yang tepat dan praktik terbaik untuk lingkungan
3. Mengedukasi pengguna tentang berbagai jenis sampah (dapat didaur ulang, organik, berbahaya, limbah elektronik, dll.)
4. Menyarankan praktik hidup berkelanjutan dan inisiatif zero waste
5. Tetap fokus pada topik pengelolaan sampah dan lingkungan

PEDOMAN PENTING:
- SELALU MERESPONS DALAM BAHASA INDONESIA yang ramah, sopan, dan mudah dipahami
- Jika pengguna bertanya tentang topik yang tidak terkait dengan pengelolaan sampah atau keberlanjutan lingkungan, dengan sopan arahkan mereka kembali ke topik terkait sampah
- Berikan informasi yang akurat dan bermanfaat tentang pengelolaan sampah
- Bersikaplah ramah dan edukatif dalam respons Anda
- Jaga respons tetap ringkas namun informatif (maksimal 3-4 paragraf)
- Jika Anda tidak tahu sesuatu, akui daripada membuat informasi palsu
- Gunakan emoji yang relevan untuk membuat percakapan lebih menarik (♻️ 🌱 🗑️ 🌍 dll.)

Selalu merespons dengan cara yang membantu, edukatif, dan fokus pada pengelolaan sampah serta keberlanjutan lingkungan dalam BAHASA INDONESIA.`;

            // Call Gemini API
            const prompt = `${systemPrompt}\n\nPertanyaan pengguna: ${messageText}`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            const botResponse = response.text() || "Maaf, saya tidak dapat menghasilkan respon. Silakan coba lagi.";

            // Save chat history to database
            const { data: savedMessage, error: dbError } = await supabase
                .from("chat_history")
                .insert({
                    user_id: user.id,
                    message: messageText,
                    response: botResponse,
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // Remove temp message and add the saved one
            setMessages((prev) => [...prev.filter((msg) => msg.id !== tempId), savedMessage]);
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            toast.error(error.message || "Gagal mengirim pesan");
            // Remove temp message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) {
            toast.error("Silakan masukkan pesan");
            return;
        }

        const userMessage = input.trim();
        setInput("");
        await sendMessage(userMessage);
    };

    const handleFAQClick = async (question: string) => {
        setInput("");
        await sendMessage(question);
    };

    const handleClearHistory = async () => {
        if (!user) return;

        try {
            const { error } = await supabase.from("chat_history").delete().eq("user_id", user.id);

            if (error) throw error;

            setMessages([]);
            toast.success("Riwayat chat berhasil dihapus");
        } catch (error: any) {
            toast.error("Gagal menghapus riwayat chat");
        }
    };

    // Render chat messages in conversation format
    const renderMessages = () => {
        const conversationMessages: Array<{ text: string; isUser: boolean; id: string }> = [];

        messages.forEach((msg) => {
            conversationMessages.push({
                text: msg.message,
                isUser: true,
                id: `${msg.id}-user`,
            });
            if (msg.response) {
                conversationMessages.push({
                    text: msg.response,
                    isUser: false,
                    id: `${msg.id}-bot`,
                });
            }
        });

        return conversationMessages;
    };

    if (isFetchingHistory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center px-4">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
                    <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                                <Bot className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                                SapuLidi Assistant
                            </h1>
                            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Tanyakan apapun tentang pengelolaan sampah dan keberlanjutan lingkungan</p>
                        </div>
                        {messages.length > 0 && (
                            <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-xs sm:text-sm">
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Hapus</span>
                            </Button>
                        )}
                    </div>

                    <Card className="shadow-xl">
                        <CardHeader className="p-3 sm:p-4 md:p-5 border-b">
                            <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                Percakapan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Messages Area */}
                            <ScrollArea className="h-[50vh] sm:h-[55vh] md:h-[60vh] p-3 sm:p-4 md:p-6" ref={scrollAreaRef}>
                                {renderMessages().length === 0 ? (
                                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                        {/* Initial AI Greeting */}
                                        <div className="flex gap-2 sm:gap-3 justify-start">
                                            <div className="flex-shrink-0">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                                                </div>
                                            </div>
                                            <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 max-w-[85%]">
                                                <p className="text-xs sm:text-sm md:text-base">
                                                    Halo! 👋 Saya <strong>SapuLidi Assistant</strong>, asisten virtual yang siap membantu Anda memahami lebih dalam tentang pengelolaan sampah dan keberlanjutan lingkungan.
                                                </p>
                                                <p className="text-xs sm:text-sm md:text-base mt-2">Saya bisa menjawab pertanyaan seputar daur ulang, kompos, pengurangan sampah, dan berbagai topik pengelolaan limbah lainnya.</p>
                                                <p className="text-xs sm:text-sm md:text-base mt-2 font-medium">Silakan pilih pertanyaan di bawah ini atau ketik pertanyaan Anda sendiri! 💬</p>
                                            </div>
                                        </div>

                                        {/* Frequently Asked Questions Card */}
                                        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                                            <CardHeader className="p-3 sm:p-4">
                                                <CardTitle className="text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2">
                                                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    Pertanyaan yang Sering Diajukan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                                                {FREQUENTLY_ASKED_QUESTIONS.map((question, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleFAQClick(question)}
                                                        disabled={isLoading}
                                                        className="w-full justify-start text-left h-auto py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                                                    >
                                                        <span className="line-clamp-2">{question}</span>
                                                    </Button>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {renderMessages().map((msg) => (
                                            <div key={msg.id} className={`flex gap-2 sm:gap-3 ${msg.isUser ? "justify-end" : "justify-start"}`}>
                                                {!msg.isUser && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`max-w-[75%] sm:max-w-[80%] md:max-w-[85%] rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 ${msg.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                    {msg.isUser ? (
                                                        <p className="text-xs sm:text-sm md:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                                                    ) : (
                                                        <div className="text-xs sm:text-sm md:text-base chatbot-markdown">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                                {msg.isUser && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center">
                                                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary-foreground" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-2 sm:gap-3 justify-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                                                    </div>
                                                </div>
                                                <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-2.5">
                                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="border-t p-3 sm:p-4 md:p-5">
                                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
                                    <Input placeholder="Tanyakan tentang pengelolaan sampah..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} className="flex-1 text-xs sm:text-sm md:text-base" />
                                    <Button type="submit" disabled={isLoading} size="sm" className="flex-shrink-0">
                                        {isLoading ? (
                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0 sm:mr-1.5" />
                                                <span className="hidden sm:inline text-xs sm:text-sm">Kirim</span>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3 sm:mt-4 px-4">Chatbot ini didukung oleh AI dan khusus untuk topik pengelolaan sampah. Respon hanya untuk tujuan informasi.</p>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
