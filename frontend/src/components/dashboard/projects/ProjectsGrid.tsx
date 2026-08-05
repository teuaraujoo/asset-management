import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectCard } from "./CreateProjectCard";
import type { Project } from "@/@types/projects/projects.types";

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  onCreateProject: () => void;
  onOpenProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <Skeleton className="size-11 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-1.5 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function ProjectsGrid({
  projects,
  isLoading,
  onCreateProject,
  onOpenProject,
  onEditProject,
  onDeleteProject,
}: ProjectsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={onOpenProject}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
        />
      ))}
      <CreateProjectCard onClick={onCreateProject} />
    </div>
  );
}