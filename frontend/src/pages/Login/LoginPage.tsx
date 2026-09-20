import { LoginBackground } from "@/components/auth/LoginBackground";
import { LoginCard } from "@/components/auth/LoginCard";

export default function LoginPage() {
    return (
        <main className="login-page relative min-h-screen overflow-hidden bg-background">
            <LoginBackground />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <LoginCard />
            </div>
        </main>
    );
};
