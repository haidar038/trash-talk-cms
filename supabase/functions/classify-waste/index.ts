import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WasteType {
    name: string;
    category: string;
    percentage: number;
    recyclable: boolean;
    recycle_reason: string;
    decomposition_time: string;
    materials: { type: string; percentage: number }[];
}

interface AnalysisResult {
    waste_types: WasteType[];
    overall_assessment: string;
    disposal_recommendations: string[];
    environmental_impact: string;
    error?: string;
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        console.log("=== Classify Waste Function Called ===");

        // Get authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            console.error("Missing authorization header");
            throw new Error("Missing authorization header");
        }

        console.log("Authorization header present");

        // Initialize Supabase client
        const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
            global: {
                headers: { Authorization: authHeader },
            },
        });

        // Verify user is authenticated
        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            throw new Error("Unauthorized");
        }

        // Get request body
        console.log("Parsing request body...");
        const { imageDataUrl } = await req.json();
        console.log("Image data URL length:", imageDataUrl?.length || 0);

        if (!imageDataUrl) {
            console.error("Missing image data in request");
            throw new Error("Missing image data");
        }

        // Check rate limiting (optional: max 10 requests per minute per user)
        const { data: recentRequests } = await supabaseClient
            .from("classification_history")
            .select("created_at")
            .eq("user_id", user.id)
            .gte("created_at", new Date(Date.now() - 60000).toISOString());

        if (recentRequests && recentRequests.length >= 10) {
            throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
        }

        const prompt = `Analisa gambar ini dan identifikasi jenis sampah yang terlihat.
                        Berikan respons dalam format JSON dengan struktur berikut:
                        {
                        "waste_types": [
                            {
                            "name": "nama jenis sampah",
                            "category": "organik/anorganik/B3/elektronik",
                            "percentage": estimasi persentase komposisi (angka saja),
                            "recyclable": true/false,
                            "recycle_reason": "alasan mengapa dapat/tidak dapat didaur ulang",
                            "decomposition_time": "waktu penguraian estimasi",
                            "materials": [
                                {
                                "type": "jenis material (contoh: plastik, kertas, metal, kaca, organik, tekstil)",
                                "percentage": estimasi persentase material (angka saja)
                                }
                            ]
                            }
                        ],
                        "overall_assessment": "penilaian keseluruhan kondisi sampah",
                        "disposal_recommendations": ["rekomendasi pengelolaan 1", "rekomendasi 2", "rekomendasi 3"],
                        "environmental_impact": "dampak lingkungan jika tidak dikelola dengan baik"
                        }

                        PENTING:
                        - Jika tidak ada sampah yang terdeteksi dalam gambar, return: {"error": "Tidak terdeteksi sampah dalam gambar", "waste_types": []}
                        - Respons HARUS dalam format JSON yang valid
                        - Jangan tambahkan teks apapun di luar JSON
                        - Persentase harus total 100% untuk semua waste_types
                        - Persentase materials dalam setiap waste_type harus total 100%
                        - Bedakan jenis sampah dan nama sampah, dimana jenis adalah kategori umum (organik, anorganik, B3, elektronik) dan nama adalah identifikasi spesifik (misal: botol plastik, kertas koran, baterai, dll)
                        - Sertakan alasan mengapa sampah tersebut dapat atau tidak dapat didaur ulang dalam properti "recycle_reason". Paragraf harus menjelaskan alasan dengan komprehensif, tone medium yang tidak terlalu panjang juga tidak terlalu ringkas (baik untuk penilaian umum, dampak lingkungan, maupun rekomendasi pembuangan)
                        `;

        // Try Groq first (fast and reliable!)
        let result: AnalysisResult | null = null;
        let error: Error | null = null;

        // Option 1: Groq API with Llama 4 Scout (Vision + Structured Outputs)
        const groqKey = Deno.env.get("GROQ_API_KEY");
        console.log("Groq API Key present:", !!groqKey);

        if (groqKey) {
            try {
                console.log("Calling Groq API with Llama 4 Scout...");

                // Create abort controller for timeout
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

                // Define JSON Schema for structured output
                const wasteSchema = {
                    type: "object",
                    properties: {
                        waste_types: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    category: { type: "string", enum: ["organik", "anorganik", "B3", "elektronik"] },
                                    percentage: { type: "number" },
                                    recyclable: { type: "boolean" },
                                    recycle_reason: { type: "string" },
                                    decomposition_time: { type: "string" },
                                    materials: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                type: { type: "string" },
                                                percentage: { type: "number" },
                                            },
                                            required: ["type", "percentage"],
                                            additionalProperties: false,
                                        },
                                    },
                                },
                                required: ["name", "category", "percentage", "recyclable", "recycle_reason", "decomposition_time", "materials"],
                                additionalProperties: false,
                            },
                        },
                        overall_assessment: { type: "string" },
                        disposal_recommendations: {
                            type: "array",
                            items: { type: "string" },
                        },
                        environmental_impact: { type: "string" },
                        error: { type: "string" },
                    },
                    required: ["waste_types", "overall_assessment", "disposal_recommendations", "environmental_impact"],
                    additionalProperties: false,
                };

                const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${groqKey}`,
                    },
                    body: JSON.stringify({
                        model: "meta-llama/llama-4-scout-17b-16e-instruct",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: prompt },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: imageDataUrl,
                                        },
                                    },
                                ],
                            },
                        ],
                        max_completion_tokens: 2000,
                        temperature: 0.3,
                        response_format: {
                            type: "json_schema",
                            json_schema: {
                                name: "waste_classification",
                                schema: wasteSchema,
                            },
                        },
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeout);

                console.log("Groq Response Status:", groqResponse.status);

                if (groqResponse.ok) {
                    const data = await groqResponse.json();
                    console.log("Groq response received, parsing...");
                    let resultText = data.choices[0]?.message?.content || "";

                    // With structured outputs, should be valid JSON already
                    result = JSON.parse(resultText);
                    console.log("Groq parsing successful!");
                } else {
                    const errorData = await groqResponse.text();
                    console.error("Groq API Error:", groqResponse.status, errorData);
                    throw new Error(`Groq API returned ${groqResponse.status}: ${errorData}`);
                }
            } catch (e) {
                error = e as Error;
                console.error("Groq failed:", error.message);
            }
        } else {
            console.log("Groq API key not found in environment");
        }

        // Option 2: Fallback to Gemini if OpenAI fails
        if (!result) {
            const geminiKey = Deno.env.get("GEMINI_API_KEY");
            if (geminiKey) {
                try {
                    const base64Data = imageDataUrl.split(",")[1];
                    const mimeType = imageDataUrl.split(";")[0].split(":")[1];

                    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contents: [
                                {
                                    parts: [
                                        { text: prompt },
                                        {
                                            inline_data: {
                                                mime_type: mimeType,
                                                data: base64Data,
                                            },
                                        },
                                    ],
                                },
                            ],
                            generationConfig: {
                                temperature: 0.4,
                                topK: 32,
                                topP: 1,
                                maxOutputTokens: 2048,
                            },
                        }),
                    });

                    if (geminiResponse.ok) {
                        const data = await geminiResponse.json();
                        let resultText = data.candidates[0]?.content?.parts[0]?.text || "";

                        // Extract JSON from markdown code blocks if present
                        if (resultText.includes("```json")) {
                            resultText = resultText.split("```json")[1].split("```")[0].trim();
                        } else if (resultText.includes("```")) {
                            resultText = resultText.split("```")[1].split("```")[0].trim();
                        }

                        result = JSON.parse(resultText);
                    }
                } catch (e) {
                    error = e as Error;
                    console.error("Gemini also failed:", error);
                }
            }
        }

        if (!result) {
            throw new Error(`Both AI services failed. Last error: ${error?.message || "Unknown error"}`);
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("=== Function Error ===");
        console.error("Error type:", typeof error);
        console.error("Error:", error);

        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error message:", errorMessage);

        return new Response(
            JSON.stringify({
                error: errorMessage,
                timestamp: new Date().toISOString(),
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
