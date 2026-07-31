import { LoginBackground } from "@/components/auth/login-background";
import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#2148C0]">
            <LoginBackground />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                <LoginCard />
            </div>
        </main>
    );
};