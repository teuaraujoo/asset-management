import { Navigate, Outlet } from "react-router-dom";
import LoadingAuth from "@/components/auth/LoadingAuth";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PublicRoute() {
    const { loading, isAuth } = useAuthContext();

    if (loading) {
        return <LoadingAuth />;
    };

    return isAuth ? <Navigate to="/dashboard/home" /> : <Outlet />;
};