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
    signIn: (credential: string, password: string) => Promise<void>;
    signInAdmin: (credential: string, password: string) => Promise<void>;
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

    const getEmailFromCredential = async (credential: string): Promise<string | null> => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential);
        if (isEmail) {
            return credential;
        }
        const { data, error } = await supabase.from("profiles").select("email").eq("username", credential).single();
        if (error || !data) {
            console.error("Error fetching email for username:", error);
            return null;
        }
        return data.email;
    };

    async function signIn(credential: string, password: string) {
        try {
            const email = await getEmailFromCredential(credential);
            if (!email) throw new Error("Invalid credential");

            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in:", error);
            setError(error instanceof Error ? error : new Error("An error occurred during sign in"));
            throw error; // Re-throw the error to be caught in the component
        }
    }

    async function signInAdmin(credential: string, password: string) {
        try {
            const email = await getEmailFromCredential(credential);
            if (!email) throw new Error("Invalid credential");

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) throw signInError;

            const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", signInData.user.id).single();
            if (profileError) throw profileError;

            if (profile.role !== "admin") {
                await supabase.auth.signOut();
                throw new Error("You are not authorized to access the admin panel.");
            }
        } catch (error) {
            console.error("Error signing in as admin:", error);
            setError(error instanceof Error ? error : new Error("An error occurred during admin sign in"));
            throw error; // Re-throw the error to be caught in the component
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
        signInAdmin,
        signUp,
        signOut,
    };
}
