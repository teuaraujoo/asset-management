import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectsHeader } from "@/components/dashboard/projects/ProjectHeader";
import { ProjectsGrid } from "@/components/dashboard/projects/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/projects/NewProjectDialog";
import { useProjects } from "@/hooks/projects/use-projects";
import { deleteProject } from "@/services/projects.services";
import type { Project } from "@/@types/projects/projects.types";

export default function DashboardProjectsPage() {
    const navigate = useNavigate();
    const { projects, isLoading, error, refetch } = useProjects();
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

    function handleOpenProject(project: Project) {
        navigate(`/dashboard/projects/${project.id}`);
    };

    function handleUploadFiles() {
        navigate("/dashboard/upload");
    };

    async function handleDeleteProject(project: Project) {
        const confirmed = window.confirm(
            `Excluir o projeto "${project.name}"? A pasta e todos os arquivos também serão excluídos.`,
        );
        if (!confirmed) return;

        try {
            await deleteProject(project.id);
            await refetch();
        } catch {
            alert("Erro ao excluir projeto. Tente novamente.");
        };
    };

    return (
        <main className="mx-auto w-full space-y-8 lg:p-2">
            <ProjectsHeader
                onNewProject={() => setIsNewProjectOpen(true)}
                onUploadFiles={handleUploadFiles}
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <ProjectsGrid
                projects={projects}
                isLoading={isLoading}
                onCreateProject={() => setIsNewProjectOpen(true)}
                onOpenProject={handleOpenProject}
                onDeleteProject={handleDeleteProject}
            />

            <NewProjectDialog
                open={isNewProjectOpen}
                onOpenChange={setIsNewProjectOpen}
                onSuccess={refetch}
            />
        </main>
    );
};