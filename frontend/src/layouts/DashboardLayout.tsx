import { Outlet } from "react-router-dom";

import { DashboardSidebar } from "@/components/dashboard/layout/Sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/Header";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-background">

            <DashboardSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

                <DashboardHeader />

                <main className="flex-1 overflow-y-auto bg-background p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}
