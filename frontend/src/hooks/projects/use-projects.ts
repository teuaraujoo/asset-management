import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/@types/projects/projects.types";
import { getProjects } from "@/services/projects.services";

interface UseProjectsReturn {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export function useProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erro ao carregar projetos",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadProjects = async () => {
            await fetchProjects();
        };

        void loadProjects();
    }, [fetchProjects]);

    return { projects, isLoading, error, refetch: fetchProjects };
};