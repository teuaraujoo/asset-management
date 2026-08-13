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
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileCardProps {
    file: FileItem;
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

export function FileCard({ file }: FileCardProps) {
    return (

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
                            // onClick={() =>
                            //     onEdit?.(project)}
                            className="cursor-pointer"
                        >
                            <Pencil className="size-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            // onClick={() => onDelete?.(project)}
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
    );
};