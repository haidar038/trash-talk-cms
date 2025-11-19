// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            throw new Error("Message is required");
        }

        // Get OpenAI API key from environment
        const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
        if (!openaiApiKey) {
            throw new Error("OpenAI API key not configured");
        }

        // System prompt to keep conversation on-topic about waste management (in Indonesian)
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

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${openaiApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message },
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "OpenAI API error");
        }

        const data = await response.json();
        const botResponse = data.choices[0]?.message?.content || "Maaf, saya tidak dapat menghasilkan respon. Silakan coba lagi.";

        // Get user from authorization header
        const authHeader = req.headers.get("Authorization");
        if (authHeader) {
            const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authHeader } } });

            // Get user session
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();

            // Save chat history to database if user is authenticated
            if (user) {
                await supabaseClient.from("chat_history").insert({
                    user_id: user.id,
                    message: message,
                    response: botResponse,
                });
            }
        }

        return new Response(JSON.stringify({ response: botResponse }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

/* To invoke this function locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chat' \
    --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
    --header 'Content-Type: application/json' \
    --data '{"message":"What is recycling?"}'

*/
