import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/auth/use-auth";
import LoadingAuth from "../components/auth/LoadingAuth";

export default function PublicRoute() {
    const { loading, isAuth } = useAuth();

    if (loading) {
        return <LoadingAuth />
    };

    return isAuth ? <Navigate to="/dashboard/home" /> : <Outlet />;
};