import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHomePage from "@/pages/Dashboard/Home";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<DashboardLayout />}>
                <Route path="/dashboard/home" element={<DashboardHomePage />} />
            </Route>
        </Routes>
    );
}