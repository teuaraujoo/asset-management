import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectsHeader } from "@/components/dashboard/projects/ProjectHeader";
import { ProjectsGrid } from "@/components/dashboard/projects/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/projects/NewProjectDialog";
import { useProjects } from "@/hooks/projects/use-projects";
import { deleteProject } from "@/services/projects.services";
import type { Project } from "@/@types/projects/projects.types";
import { UploadFileDialog } from "@/components/dashboard/projects/UploadFileDialog";
import toast from "react-hot-toast";

export default function DashboardProjectsPage() {
    const navigate = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { projects, isLoading, error, refetch } = useProjects();
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    function handleOpenProject(project: Project) {
        navigate(`/dashboard/projects/${project.folder_id}`);
    };

    function handleCreateProject() {
        setSelectedProject(null);
        setIsProjectDialogOpen(true);
    };

    function handleEditProject(project: Project) {
        setSelectedProject(project);
        setIsProjectDialogOpen(true);
    };

    function handleProjectDialogOpenChange(open: boolean) {
        setIsProjectDialogOpen(open);

        if (!open) setSelectedProject(null);
    };

    async function handleDeleteProject(project: Project) {
        await toast.promise(deleteProject(project.id), {
            loading: 'Excluindo...',
            success: (response) => response.message,
            error: (error) => error.message || "Error ao conectar com o servidor!",
        });
        await refetch();
    };

    return (
        <main className="mx-auto w-full space-y-8 lg:p-2">
            <ProjectsHeader
                onNewProject={handleCreateProject}
                onUploadFiles={() => setIsUploadOpen(true)}
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <ProjectsGrid
                projects={projects}
                isLoading={isLoading}
                onCreateProject={handleCreateProject}
                onOpenProject={handleOpenProject}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
            />

            <NewProjectDialog
                open={isProjectDialogOpen}
                onOpenChange={handleProjectDialogOpenChange}
                onSuccess={refetch}
                project={selectedProject}
            />

            <UploadFileDialog
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                projects={projects}
            />
        </main>
    );
};
