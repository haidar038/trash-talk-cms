export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    username: string | null;
                    avatar_url: string | null;
                    role: "user" | "admin";
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    username?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    username?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    updated_at?: string;
                };
            };
        };
        Functions: {
            is_admin: {
                Args: {
                    user_id: string;
                };
                Returns: boolean;
            };
        };
        Enums: {
            user_role: "user" | "admin";
        };
    };
}
