import { useFiles } from "@/hooks/files/use-files";
import { useParams, useNavigate } from "react-router-dom";
import { FileCard } from "@/components/dashboard/files/FileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { deleteFile, renameFile } from "@/services/files.services";
import type { FileItem } from "@/@types/files/files.types";

export default function DashboardProjectPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { files, isLoading, error, refetch } = useFiles(id);

    if (!id) return null;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
                <p>{error}</p>
            </div>
        );
    };

    async function handleDeleteFile(file: FileItem) {
        await toast.promise(deleteFile(file.id), {
            loading: 'Excluindo...',
            success: (response) => response.message,
            error: (error) => error.message || "Error ao conectar com o servidor!",
        });

        await refetch();
    };

    async function handleRename(id: string, name: string) {
        await toast.promise(renameFile(id, name), {
            loading: 'Renomeando...',
            success: (response) => response.message,
            error: (error) => error.message || "Error ao conectar com o servidor!",
        });

        await refetch();
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => navigate("/dashboard/projects")}
                    aria-label="Voltar para projetos"
                >
                    <ArrowLeft className="size-4" />
                    Voltar
                </Button>
                <div className="h-4 w-px bg-border" aria-hidden="true" />
                <h2 className="text-2xl font-bold tracking-tight">Arquivos do Projeto</h2>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex flex-col h-[200px] border rounded-xl overflow-hidden">
                            <div className="flex-1 p-4 bg-muted/20 flex flex-col items-center justify-center">
                                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="p-3 bg-muted/40 border-t flex justify-between">
                                <Skeleton className="h-3 w-8" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl border-dashed">
                    <p className="text-lg font-medium text-muted-foreground">Nenhum arquivo encontrado.</p>
                    <p className="text-sm text-muted-foreground mt-1">Faça upload de arquivos para vê-los aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map((file) => (
                        <FileCard key={file.id} file={file} onDelete={handleDeleteFile} onRename={handleRename} />
                    ))}
                </div>
            )}
        </div>
    );
}