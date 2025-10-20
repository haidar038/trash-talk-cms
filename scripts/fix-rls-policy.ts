import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRlsPolicy() {
    console.log("Starting RLS policy fix...");

    const { error } = await supabase.rpc("sql", {
        sql: `
            DROP POLICY IF EXISTS "View profiles is enabled for all users" ON public.profiles;
            CREATE POLICY "View profiles is enabled for all users" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
        `
    });

    if (error) {
        console.error("Failed to fix RLS policy:", error);
    } else {
        console.log("Successfully fixed RLS policy.");
    }

    console.log("RLS policy fix completed");
}

fixRlsPolicy()
    .catch(console.error)
    .finally(() => process.exit(0));
