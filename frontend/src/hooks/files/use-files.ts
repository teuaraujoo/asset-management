import { useCallback, useEffect, useState } from "react";
import { getFilesByFolderiId } from "@/services/files.services";
import type { FileItem } from "@/@types/files/files.types";

interface UseFilesReturn {
    files: FileItem[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFiles(id?: string): UseFilesReturn {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const load = async () => {
            if (!id) return;
            if (isMounted) setIsLoading(true);
            try {
                const data = await getFilesByFolderiId(id);
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
    }, [id]);

    const refetch = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await getFilesByFolderiId(id);
            setFiles(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar arquivos");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    return { files, isLoading, error, refetch };
};