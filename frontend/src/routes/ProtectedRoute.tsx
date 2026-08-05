import { Navigate, Outlet } from "react-router-dom";
import LoadingAuth from "../components/auth/LoadingAuth";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ProtectedRoute() {
    const { loading, isAuth } = useAuthContext();

    if (loading) {
        return <LoadingAuth />;
    };

    return isAuth ? <Outlet /> : <Navigate to="/" />;
};