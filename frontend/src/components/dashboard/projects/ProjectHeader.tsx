import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
    onNewProject: () => void;
    onUploadFiles: () => void;
}

export function ProjectsHeader({
    onNewProject,
    onUploadFiles,
}: ProjectsHeaderProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Seus Projetos
                </h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie e organize seus ativos digitais
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onNewProject}>
                    <Plus className="size-4" />
                    Novo Projeto
                </Button>
                <Button onClick={onUploadFiles} className="bg-blue-600 hover:bg-blue-800">
                    <Upload className="size-4" />
                    Upload Arquivos
                </Button>
            </div>
        </header>
    );
};