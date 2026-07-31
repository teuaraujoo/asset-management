import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login/LoginPage";
import AuthLayout from "@/layouts/AuthLayout";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>
        </Routes>
    );
}