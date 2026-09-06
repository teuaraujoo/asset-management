import { EyeOff, Folder, Globe2, LoaderCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/@types/projects/projects.types";
import { formatRelativeDate } from "@/utils/date.utils";

interface ProjectCardProps {
    project: Project;
    progress?: number;
    onOpen?: (project: Project) => void;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    onPublish?: (project: Project) => void;
    isPublishing?: boolean;
}

export function ProjectCard({
    project,
    progress = 1,
    onOpen,
    onEdit,
    onDelete,
    onPublish,
    isPublishing = false,
}: ProjectCardProps) {
    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(project)}
            onKeyDown={(e) => e.key === "Enter" && onOpen?.(project)}
            className="group cursor-pointer border-border bg-card transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
            <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                        <Folder className="size-5 text-primary" />
                    </div>

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
                                onClick={() =>
                                    onEdit?.(project)}
                                className="cursor-pointer"
                            >
                                <Pencil className="size-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete?.(project)}
                                className="cursor-pointer"
                            >
                                <Trash2 className="size-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`size-2.5 shrink-0 rounded-full ring-4 ${project.published
                                ? "bg-emerald-500 ring-emerald-500/15"
                                : "bg-zinc-400 ring-zinc-400/15"
                                }`}
                            title={project.published ? "Projeto publicado" : "Projeto não publicado"}
                            aria-label={project.published ? "Projeto publicado" : "Projeto não publicado"}
                        />
                        <h3 className="truncate font-semibold text-foreground">
                            {project.name}
                        </h3>
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                        {project.mini_description}
                    </p>
                </div>

                <Progress value={progress} className="h-1.5" />

                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>atualizado {formatRelativeDate(project.updated_at)}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-xs"
                        disabled={isPublishing}
                        onClick={(event) => {
                            event.stopPropagation();
                            onPublish?.(project);
                        }}
                        aria-label={project.published ? `Despublicar ${project.name}` : `Publicar ${project.name}`}
                    >
                        {isPublishing ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                        ) : project.published ? (
                            <EyeOff className="size-3.5" />
                        ) : (
                            <Globe2 className="size-3.5" />
                        )}
                        {project.published ? "Despublicar" : "Publicar"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
