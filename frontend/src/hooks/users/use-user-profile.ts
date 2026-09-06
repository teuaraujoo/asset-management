import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/@types/users/users.types";
import { getUserProfile } from "@/services/users.services";

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getUserProfile() as UserProfile;
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar perfil.");
        } finally {
            setIsLoading(false);
        };
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            await refetch();
        };

        void loadProfile();
    }, [refetch]);

    return { profile, isLoading, error, refetch };
}
