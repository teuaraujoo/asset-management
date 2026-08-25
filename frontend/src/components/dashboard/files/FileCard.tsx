import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { FileItem } from "@/@types/files/files.types";
import {
    FileIcon,
    ImageIcon,
    VideoIcon,
    FileTextIcon,
    ArchiveIcon,
    Pencil,
    MoreVertical,
    Trash2,
    Download
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilePreview } from "@/services/files.services";

interface FileCardProps {
    file: FileItem;
    onDelete?: (file: FileItem) => void;
    onRename?: (id: string, name: string) => void;
    onDownload?: (id: string) => void;
}

const renderIcon = (mimeType: string | undefined, className: string) => {
    if (!mimeType) return <FileIcon className={className} />;
    if (mimeType.startsWith("image/")) return <ImageIcon className={className} />;
    if (mimeType.startsWith("video/")) return <VideoIcon className={className} />;
    if (mimeType.includes("pdf") || mimeType.includes("text/")) return <FileTextIcon className={className} />;
    if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar")) return <ArchiveIcon className={className} />;
    return <FileIcon className={className} />;
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/** Captura o primeiro frame de um vídeo via URL e retorna como data URL */
function captureVideoFrame(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
            video.src = "";
            video.remove();
        };

        video.onloadeddata = () => {
            video.currentTime = 0;
        };

        video.onseeked = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 180;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    cleanup();
                    reject(new Error("Canvas context indisponível."));
                    return;
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                cleanup();
                resolve(dataUrl);
            } catch (err) {
                cleanup();
                reject(err);
            }
        };

        video.onerror = () => {
            cleanup();
            reject(new Error("Erro ao carregar vídeo para thumbnail."));
        };

        video.src = videoUrl;
        video.load();
    });
};

type PreviewState = "idle" | "loading" | "ready" | "error";

export function FileCard({ file, onDelete, onRename, onDownload }: FileCardProps) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewState, setPreviewState] = useState<PreviewState>("idle");
    const hasFetched = useRef(false);

    const isImage = file.mime_type?.startsWith("image/");
    const isVideo = file.mime_type?.startsWith("video/");
    const isPreviewable = isImage || isVideo;

    const loadPreview = useCallback(async () => {
        if (!isPreviewable || hasFetched.current) return;
        hasFetched.current = true;
        setPreviewState("loading");

        try {
            const response = await getFilePreview(file.id);
            const previewUrl: string = response?.preview_url;

            if (!previewUrl) throw new Error("URL de preview inválida.");

            if (isImage) {
                setPreviewSrc(previewUrl);
                setPreviewState("ready");
            } else if (isVideo) {
                const frame = await captureVideoFrame(previewUrl);
                setPreviewSrc(frame);
                setPreviewState("ready");
            }
        } catch {
            setPreviewState("error");
        }
    }, [file.id, isPreviewable, isImage, isVideo]);

    useEffect(() => {
        loadPreview();
    }, [loadPreview]);

    const getBaseName = () => {
        if (!file.original_name) return "";
        if (file.extension && file.original_name.endsWith(file.extension)) {
            return file.original_name.slice(0, -file.extension.length);
        }
        return file.original_name;
    };

    const [newName, setNewName] = useState(getBaseName());

    const handleRenameSubmit = () => {
        const trimmedName = newName.trim();
        if (trimmedName) {
            const finalName = file.extension && !trimmedName.endsWith(file.extension)
                ? `${trimmedName}${file.extension}`
                : trimmedName;

            if (finalName !== file.original_name) {
                onRename?.(file.id, finalName);
            };
        };
        setIsRenameOpen(false);
    };

    const renderPreviewArea = () => {
        // Skeleton enquanto carrega
        if (previewState === "loading") {
            return <Skeleton className="w-full h-full rounded-none absolute inset-0" />;
        }

        // Thumbnail pronta (imagem ou frame de vídeo)
        if (previewState === "ready" && previewSrc) {
            return (
                <img
                    src={previewSrc}
                    alt={file.original_name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            );
        }

        // Fallback: ícone genérico
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                {renderIcon(file.mime_type, "w-16 h-16 text-muted-foreground/50 group-hover:text-primary transition-colors mb-4")}
                <h3 className="font-medium text-sm text-center line-clamp-2 px-2" title={file.original_name}>
                    {file.original_name || "Arquivo Desconhecido"}
                </h3>
            </div>
        );
    };

    return (
        <>
            <Card className="relative flex flex-col overflow-hidden transition-all hover:shadow-md h-72 gap-0 p-0">
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Ações do arquivo"
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                                onClick={() => {
                                    setNewName(getBaseName());
                                    setIsRenameOpen(true);
                                }}
                                className="cursor-pointer"
                            >
                                <Pencil className="size-4" />
                                Renomear
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="default"
                                onClick={() => onDownload?.(file.id)}
                                className="cursor-pointer"
                            >
                                <Download className="size-4" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete?.(file)}
                                className="cursor-pointer"
                            >
                                <Trash2 className="size-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Área de preview — ocupa todo o espaço acima do footer */}
                <CardContent className="p-0 relative flex items-center justify-center bg-muted/20 overflow-hidden flex-1">
                    {renderPreviewArea()}

                    {/* Nome do arquivo sobreposto ao preview quando há thumbnail */}
                    {previewState === "ready" && previewSrc && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                            <p className="text-white text-xs font-medium line-clamp-1" title={file.original_name}>
                                {file.original_name || "Arquivo Desconhecido"}
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-3 bg-muted/40 flex items-center justify-between text-xs text-muted-foreground border-t">
                    <span className="uppercase font-semibold tracking-wider">
                        {(file.extension || "").replace(".", "")}
                    </span>
                    <span>{formatBytes(Number(file.size || 0))}</span>
                </CardFooter>

            </Card>

            {/* DIALOG - RENOMEAR ARQUVIO */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Renomear arquivo</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor={`rename-${file.id}`} className="sr-only">Novo nome</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id={`rename-${file.id}`}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Novo nome do arquivo"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRenameSubmit();
                                    }
                                }}
                            />
                            {file.extension && (
                                <span className="text-muted-foreground text-sm font-medium">
                                    {file.extension}
                                </span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>Cancelar</Button>
                        <Button onClick={handleRenameSubmit}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};