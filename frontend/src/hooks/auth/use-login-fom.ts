import { login } from "@/services/auth.services";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/schemas/auth/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const rememberedEmailKey = "ams:remembered-email";

function getRememberedEmail(): string {
    try {
        return window.localStorage.getItem(rememberedEmailKey) ?? "";
    } catch {
        return "";
    }
}

export function useLoginForm() {
    const navigate = useNavigate();
    const { refreshUser } = useAuthContext();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: getRememberedEmail(),
            password: ""
        },
    });

    async function handleLogin(data: LoginFormData, rememberEmail = false) {
        form.clearErrors("root");

        try {
            const request = await login(data);

            if (request.err) {
                form.setError("root", {
                    message: request.err
                });
                return;
            };

            try {
                if (rememberEmail) {
                    window.localStorage.setItem(rememberedEmailKey, data.email);
                } else {
                    window.localStorage.removeItem(rememberedEmailKey);
                }
            } catch {
                // O login continua funcionando quando o armazenamento local está indisponível.
            }

            toast.success(request.message);
            navigate("/dashboard/projects", { replace: true });
            await refreshUser();
            form.reset();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error inesperado ao fazer login. Tente novamente.";
            form.setError("root", {
                message: message
            });
        };
    };

    return {
        form,
        loading: form.formState.isSubmitting,
        handleLogin,
    };
};
