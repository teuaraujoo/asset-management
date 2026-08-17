import { useState } from "react";
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

export function FileCard({ file, onDelete, onRename, onDownload }: FileCardProps) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);

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

    return (
        <>
            <Card className="relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-md group">
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Ações do projeto"
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
                <CardContent className="p-4 flex flex-col items-center justify-center flex-1 bg-muted/20">
                    {renderIcon(file.mime_type, "w-16 h-16 text-muted-foreground/50 group-hover:text-primary transition-colors mb-4")}
                    <h3 className="font-medium text-sm text-center line-clamp-2" title={file.original_name}>
                        {file.original_name || "Arquivo Desconhecido"}
                    </h3>
                </CardContent>

                <CardFooter className="p-3 bg-muted/40 flex items-center justify-between text-xs text-muted-foreground border-t">
                    <span className="uppercase font-semibold tracking-wider">
                        {(file.extension || "").replace(".", "")}
                    </span>
                    <span>{formatBytes(Number(file.size || 0))}</span>
                </CardFooter>

            </Card>

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