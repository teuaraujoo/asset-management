import { login } from "@/services/auth.services";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export function useLoginForm() {
    const navigate = useNavigate();
    const { refreshUser } = useAuthContext();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    async function handleLogin(data: LoginFormData) {
        form.clearErrors("root");

        try {
            const request = await login(data);

            if (request.err) {
                form.setError("root", {
                    message: request.err
                });
                return;
            };

            toast.success(request.message);
            navigate("/dashboard/home", { replace: true });
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