import { user } from "@/services/auth.services";
import { useState, useEffect } from "react";

export default function useAuth() {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                const request = await user();

                if (request) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            };
        };
        checkAuth();
    }, []);

    return { loading, isAuth };
};