import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/@types/projects/projects.types";
import { getProjectById } from "@/services/projects.services";

interface UseProjectReturn {
    project: Project | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useProject(projectId?: string): UseProjectReturn {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = useCallback(async () => {
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getProjectById(projectId) as Project;
            setProject(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar projeto");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        const loadProject = async () => {
            await fetchProject();
        };

        void loadProject();
    }, [fetchProject]);

    return { project, isLoading, error, refetch: fetchProject };
}
