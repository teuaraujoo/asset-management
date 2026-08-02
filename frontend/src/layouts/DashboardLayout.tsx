import { Outlet } from "react-router-dom";

import { DashboardSidebar } from "@/components/dashboard/layout/Sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/Header";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-muted/30">

            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}