import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProjects } from "./use-projects";
import { createProject } from "@/services/projects.services";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas/projects/projects.schema";
import toast from "react-hot-toast";

export function useProjectsForm() {
    const { refetch } = useProjects();

    const [error, setError] = useState("");

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            user_id: "",
            name: "",
            mini_description: "",
            description: ""
        },
    });

    async function handleCreate(data: CreateProjectFormData) {
        setError("");

        try {
            const request = await createProject(data);

            if (request.err) {
                setError(request.err);
                return;
            };

            toast.success(request.message);
            await refetch();
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
        handleCreate
    };
};