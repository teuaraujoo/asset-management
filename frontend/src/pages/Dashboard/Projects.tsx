import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProjectsHeader } from "@/components/dashboard/projects/ProjectHeader";
import { ProjectsGrid } from "@/components/dashboard/projects/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/projects/NewProjectDialog";
import { useProjects } from "@/hooks/projects/use-projects";
import { deleteProject, publishProject, unPublishProject } from "@/services/projects.services";
import type { Project } from "@/@types/projects/projects.types";
import { UploadFileDialog } from "@/components/dashboard/projects/UploadFileDialog";
import { DeleteProjectDialog } from "@/components/dashboard/projects/DeleteProjectDialog";
import toast from "react-hot-toast";

export default function DashboardProjectsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const isUploadOpen = searchParams.get("upload") === "true";
    const { projects, isLoading, error, refetch } = useProjects();
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isDeletingProject, setIsDeletingProject] = useState(false);
    const [publishingProjectId, setPublishingProjectId] = useState<string | null>(null);

    function handleUploadOpenChange(open: boolean) {
        const nextParams = new URLSearchParams(searchParams);

        if (open) {
            nextParams.set("upload", "true");
        } else {
            nextParams.delete("upload");
        };

        setSearchParams(nextParams, {
            replace: true,
        });
    }

    function handleOpenProject(project: Project) {
        navigate(`/dashboard/projects/${project.id}`);
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

    function handleDeleteProject(project: Project) {
        setProjectToDelete(project);
    };

    function handleDeleteDialogOpenChange(open: boolean) {
        if (!open && !isDeletingProject) setProjectToDelete(null);
    };

    async function confirmDeleteProject() {
        if (!projectToDelete || isDeletingProject) return;

        setIsDeletingProject(true);

        try {
            await toast.promise(deleteProject(projectToDelete.id), {
                loading: "Excluindo...",
                success: (response) => response.message,
                error: (error) => error instanceof Error
                    ? error.message
                    : "Erro ao conectar com o servidor!",
            });

            await refetch();
            setProjectToDelete(null);
        } catch {
            // O toast acima apresenta o erro ao usuário.
        } finally {
            setIsDeletingProject(false);
        }
    };

    async function handlePublishProject(project: Project) {
        if (publishingProjectId) return;

        setPublishingProjectId(project.id);

        try {
            await toast.promise(project.published ? unPublishProject(project.id) : publishProject(project.id), {
                loading: project.published ? "Despublicando..." : "Publicando...",
                success: (response) => response.message,
                error: (error) => error instanceof Error
                    ? error.message
                    : "Erro ao alterar publicação do projeto.",
            });

            await refetch();
        } catch {
            // O toast apresenta o erro ao usuário.
        } finally {
            setPublishingProjectId(null);
        }
    };

    return (
        <main className="mx-auto w-full space-y-8 lg:p-2">
            <ProjectsHeader
                onNewProject={handleCreateProject}
                onUploadFiles={() => handleUploadOpenChange(true)}
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
                onPublishProject={handlePublishProject}
                publishingProjectId={publishingProjectId}
            />

            <NewProjectDialog
                open={isProjectDialogOpen}
                onOpenChange={handleProjectDialogOpenChange}
                onSuccess={refetch}
                project={selectedProject}
            />

            <UploadFileDialog
                open={isUploadOpen}
                onOpenChange={handleUploadOpenChange}
                projects={projects}
            />

            <DeleteProjectDialog
                project={projectToDelete}
                isDeleting={isDeletingProject}
                onOpenChange={handleDeleteDialogOpenChange}
                onConfirm={confirmDeleteProject}
            />
        </main>
    );
};
