import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProjects } from "./use-projects";
import { createProject } from "@/services/projects.services";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas/projects/projects.schema";
import toast from "react-hot-toast";

export function useProjectsForm() {
    const { refetch } = useProjects();

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            mini_description: "",
            description: ""
        },
    });

    async function handleCreate(data: CreateProjectFormData) {
        form.clearErrors("root");

        try {
            const request = await createProject(data);

            if (request.err) {
                form.setError("root", {
                    message: request.err
                });
                return;
            };

            toast.success(request.message);
            await refetch();
            form.reset();
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error inesperado ao fazer login. Tente novamente.";
            form.setError("root", {
                message: message
            });
            return false;
        };
    };

    return {
        form,
        loading: form.formState.isSubmitting,
        handleCreate
    };
};