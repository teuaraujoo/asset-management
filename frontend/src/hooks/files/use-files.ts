import { useCallback, useEffect, useState } from "react";
import { getFilesByProjectId } from "@/services/files.services";
import type { FileItem } from "@/@types/files/files.types";

interface UseFilesReturn {
    files: FileItem[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFiles(projectId?: string): UseFilesReturn {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const load = async () => {
            if (!projectId) return;
            if (isMounted) setIsLoading(true);
            try {
                const data = await getFilesByProjectId(projectId);
                if (isMounted) {
                    setFiles(data);
                    setError(null);
                };
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Erro ao carregar arquivos");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            };
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, [projectId]);

    const refetch = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const data = await getFilesByProjectId(projectId);
            setFiles(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar arquivos");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    return { files, isLoading, error, refetch };
};
