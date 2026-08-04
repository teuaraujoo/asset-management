import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/auth/use-auth";

export default function PublicRoute() {
    const { isAuth } = useAuth();

    return isAuth ? <Navigate to="/dashboard/home" /> : <Outlet />;
};