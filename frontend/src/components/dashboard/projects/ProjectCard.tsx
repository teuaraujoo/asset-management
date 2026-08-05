import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
}

export function ProjectCard({
    project,
    progress = 1,
    onOpen,
    onEdit,
    onDelete,
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
                    <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50">
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
                    <h3 className="truncate font-semibold text-foreground">
                        {project.name}
                    </h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                        {project.mini_description}
                    </p>
                </div>

                <Progress value={progress} className="h-1.5" />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatRelativeDate(project.updated_at)}</span>
                </div>
            </CardContent>
        </Card>
    );
};