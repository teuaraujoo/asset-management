import { login } from "@/services/auth.services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";


export function useLoginForm() {
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    async function handleLogin(data: LoginFormData) {
        setError("");

        try {
            const request = await login(data);

            if (request.err) {
                setError(request.err);
                return;
            };

            navigate("/dashboard/home");

            form.reset();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error inesperado ao fazer login. Tente novamente.";
            setError(message);
        };
    };

    return {
        form,
        error,
        loading: form.formState.isSubmitting,
        handleLogin,
    };
};