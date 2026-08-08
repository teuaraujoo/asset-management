import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PublicRoute() {
    const { isAuth } = useAuthContext();

    return isAuth ? <Navigate to="/dashboard/projects" /> : <Outlet />;
};