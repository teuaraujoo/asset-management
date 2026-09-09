import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardProjectsPage from "@/pages/Dashboard/Projects";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardProjectPage from "@/pages/Dashboard/Project";
import { NotFound } from "@/NotFound";
import DashboardProfilePage from "@/pages/Dashboard/Profile";
import DashboardSettingsPage from "@/pages/Dashboard/Settings";
import DashboardDocumentationPage from "@/pages/Dashboard/Documentation";

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
                    <Route path="/dashboard/projects" element={<DashboardProjectsPage />} />
                    <Route path="/dashboard/projects/:id" element={<DashboardProjectPage />} />
                    <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
                    <Route path="/dashboard/settings" element={<DashboardSettingsPage />} />
                    <Route path="/dashboard/documentation" element={<DashboardDocumentationPage />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
