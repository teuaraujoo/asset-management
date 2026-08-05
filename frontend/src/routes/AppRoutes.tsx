import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHomePage from "@/pages/Dashboard/Home";
import DashboardProjectsPage from "@/pages/Dashboard/Projects";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardProjectPage from "@/pages/Dashboard/Project";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard/home" element={<DashboardHomePage />} />
                    <Route path="/dashboard/projects" element={<DashboardProjectsPage />} />
                    <Route path="/dashboard/projects/:id" element={<DashboardProjectPage />} />
                </Route>
            </Route>
        </Routes>
    );
};