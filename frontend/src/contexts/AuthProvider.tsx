import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { logout as logoutRequest, user as getUser } from "@/services/auth.services";
import type { AuthUser } from "@/@types/auth/auth.types";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await getUser();
            setUser(response?.data ?? response ?? null);
        } catch {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        let active = true;

        const loadUser = async () => {
            try {
                const response = await getUser();

                if (!active) return;

                setUser(response?.data ?? response ?? null);
            } catch {
                if (!active) return;

                setUser(null);
            } finally {
                if (active) setLoading(false);
            };
        };

        void loadUser();

        return () => {
            active = false;
        };
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuth: !!user,
            loading,
            refreshUser,
            logout,
        }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};