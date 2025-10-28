// src/pages/ClassificationHistory.tsx
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useClassificationHistory } from "@/hooks/use-classification-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Calendar, ImageIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ClassificationHistory = () => {
    const { user } = useAuth();
    const { history, isLoading, deleteClassification } = useClassificationHistory(user?.id);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleDelete = async () => {
        if (deleteId) {
            await deleteClassification.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const getCategoryClass = (category: string) => {
        const cat = category?.toLowerCase() || "";
        if (cat.includes("organik")) return "bg-green-100 text-green-800";
        if (cat.includes("b3") || cat.includes("hazardous")) return "bg-red-100 text-red-800";
        if (cat.includes("elektronik")) return "bg-purple-100 text-purple-800";
        return "bg-blue-100 text-blue-800";
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">📋 Riwayat Klasifikasi</h1>
                <p className="text-muted-foreground">Lihat semua hasil identifikasi sampah yang telah Anda lakukan</p>
            </div>

            {!history || history.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">Belum ada riwayat klasifikasi</p>
                        <p className="text-sm text-muted-foreground mt-2">Mulai identifikasi sampah untuk melihat riwayat di sini</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {history.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Klasifikasi #{item.id}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(item.created_at), "dd MMMM yyyy, HH:mm", {
                                                locale: localeId,
                                            })}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    {/* Image Preview */}
                                    <div className="md:col-span-1">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt="Classified waste" className="w-full h-48 object-cover rounded-lg border" />
                                        ) : (
                                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Results */}
                                    <div className="md:col-span-2 space-y-4">
                                        {item.result?.waste_types?.map((waste: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-2">
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <h4 className="font-semibold text-lg capitalize">{waste.name}</h4>
                                                    <Badge className={getCategoryClass(waste.category)}>{waste.category}</Badge>
                                                    <Badge variant={waste.recyclable ? "default" : "destructive"}>{waste.recyclable ? "♻️ Dapat didaur ulang" : "🚫 Tidak dapat didaur ulang"}</Badge>
                                                    <Badge variant="outline">{waste.percentage}% yakin</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>Waktu Penguraian:</strong> {waste.decomposition_time}
                                                </p>
                                            </div>
                                        ))}

                                        {item.result?.overall_assessment && (
                                            <div className="pt-2">
                                                <p className="text-sm">
                                                    <strong>Penilaian:</strong> {item.result.overall_assessment}
                                                </p>
                                            </div>
                                        )}

                                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                            Lihat Detail Lengkap
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
                        <AlertDialogDescription>Apakah Anda yakin ingin menghapus riwayat klasifikasi ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Detail Dialog */}
            {selectedItem && (
                <AlertDialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Detail Klasifikasi #{selectedItem.id}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                            {selectedItem.image_url && <img src={selectedItem.image_url} alt="Classified waste" className="w-full max-h-64 object-contain rounded-lg border" />}

                            {selectedItem.result?.waste_types?.map((waste: any, idx: number) => (
                                <div key={idx} className="space-y-2 p-4 bg-muted/30 rounded-lg">
                                    <h4 className="font-semibold capitalize">{waste.name}</h4>
                                    <p className="text-sm">
                                        <strong>Kategori:</strong> {waste.category}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Dapat didaur ulang:</strong> {waste.recyclable ? "Ya" : "Tidak"}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Alasan:</strong> {waste.recycle_reason}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Waktu Penguraian:</strong> {waste.decomposition_time}
                                    </p>
                                    {waste.materials && waste.materials.length > 0 && (
                                        <div className="text-sm">
                                            <strong>Material:</strong>
                                            <ul className="list-disc list-inside ml-4">
                                                {waste.materials.map((mat: any, i: number) => (
                                                    <li key={i} className="capitalize">
                                                        {mat.type}: {mat.percentage}%
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {selectedItem.result?.disposal_recommendations && (
                                <div>
                                    <h4 className="font-semibold mb-2">💡 Rekomendasi Pembuangan:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {selectedItem.result.disposal_recommendations.map((rec: string, i: number) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedItem.result?.environmental_impact && (
                                <div>
                                    <h4 className="font-semibold mb-2">🌍 Dampak Lingkungan:</h4>
                                    <p className="text-sm">{selectedItem.result.environmental_impact}</p>
                                </div>
                            )}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Tutup</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};

export default ClassificationHistory;
