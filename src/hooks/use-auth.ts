import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UseAuth {
    user: User | null;
    profile: Profile | null;
    isAdmin: boolean;
    loading: boolean;
    error: Error | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, userData: { full_name: string; username: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

export function useAuth(): UseAuth {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
        });

        // Listen for changes in auth state
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function fetchProfile(userId: string) {
        try {
            const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

            if (error) throw error;

            setProfile(data);
            setIsAdmin(data.role === "admin");
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error instanceof Error ? error : new Error("An error occurred"));
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in:", error);
            setError(error instanceof Error ? error : new Error("An error occurred during sign in"));
        }
    }

    async function signUp(email: string, password: string, userData: { full_name: string; username: string }) {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: userData.full_name,
                        username: userData.username,
                    },
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing up:", error);
            setError(error instanceof Error ? error : new Error("An error occurred during sign up"));
        }
    }

    async function signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Error signing out:", error);
            setError(error instanceof Error ? error : new Error("An error occurred during sign out"));
        }
    }

    return {
        user,
        profile,
        isAdmin,
        loading,
        error,
        signIn,
        signUp,
        signOut,
    };
}
