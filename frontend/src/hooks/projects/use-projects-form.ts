import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createProject, updateProject } from "@/services/projects.services";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas/projects/projects.schema";
import toast from "react-hot-toast";
import type { Project } from "@/@types/projects/projects.types";

export function useProjectsForm(project?: Project | null) {
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            mini_description: "",
            description: ""
        },
    });

    useEffect(() => {
        form.reset({
            name: project?.name ?? "",
            mini_description: project?.mini_description ?? "",
            description: project?.description ?? "",
        });
    }, [form, project]);

    async function handleSubmit(data: CreateProjectFormData) {
        form.clearErrors("root");

        try {
            const request = project
                ? await updateProject(data, project.id)
                : await createProject(data);

            if (request.err) {
                form.setError("root", {
                    message: request.err
                });
                return;
            };

            toast.success(request.message);
            form.reset();
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro inesperado ao salvar projeto.";
            form.setError("root", {
                message: message
            });
            return false;
        };
    };

    return {
        form,
        loading: form.formState.isSubmitting,
        handleSubmit,
    };
};
