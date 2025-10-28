// src/hooks/use-classification-history.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClassificationHistoryItem {
    id: number;
    created_at: string;
    user_id: string;
    image_url: string | null;
    result: any;
    accuracy: number | null;
}

export const useClassificationHistory = (userId?: string) => {
    const queryClient = useQueryClient();

    // Fetch classification history
    const {
        data: history,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["classification-history", userId],
        queryFn: async () => {
            if (!userId) return [];

            const { data, error } = await supabase.from("classification_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });

            if (error) throw error;
            return data as ClassificationHistoryItem[];
        },
        enabled: !!userId,
    });

    // Save classification result
    const saveClassification = useMutation({
        mutationFn: async (payload: { user_id: string; image_url: string | null; result: any; accuracy: number | null }) => {
            const { data, error } = await supabase.from("classification_history").insert([payload]).select().single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classification-history"] });
            toast.success("Hasil klasifikasi disimpan!");
        },
        onError: (error: any) => {
            console.error("Error saving classification:", error);
            toast.error("Gagal menyimpan hasil klasifikasi");
        },
    });

    // Delete classification history item
    const deleteClassification = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from("classification_history").delete().eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classification-history"] });
            toast.success("Riwayat berhasil dihapus!");
        },
        onError: (error: any) => {
            console.error("Error deleting classification:", error);
            toast.error("Gagal menghapus riwayat");
        },
    });

    return {
        history,
        isLoading,
        error,
        saveClassification,
        deleteClassification,
    };
};
