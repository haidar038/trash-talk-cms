import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable");
}

async function fixRlsPolicy() {
    console.log("Starting RLS policy fix...");

    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("Connected to the database.");

        const sql = `
            DROP POLICY IF EXISTS "View profiles is enabled for all users" ON public.profiles;
            CREATE POLICY "View profiles is enabled for all users" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
        `;

        await client.query(sql);
        console.log("Successfully fixed RLS policy.");

    } catch (error) {
        console.error("Failed to fix RLS policy:", error);
    } finally {
        await client.end();
        console.log("Disconnected from the database.");
    }

    console.log("RLS policy fix completed");
}

fixRlsPolicy()
    .catch(console.error)
    .finally(() => process.exit(0));
