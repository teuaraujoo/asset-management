import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createProject } from "@/services/projects.services";
import { type CreateProjectFormData, createProjectSchema } from "@/schemas/projects/projects.schema";

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function NewProjectDialog({
    open,
    onOpenChange,
    onSuccess,
}: NewProjectDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            mini_description: "",
            description: "",
        },
    });

    async function onSubmit(data: CreateProjectFormData) {
        try {
            await createProject(data);
            reset();
            onOpenChange(false);
            onSuccess();
        } catch (err) {
            setError("root", {
                message:
                    err instanceof Error ? err.message : "Erro ao criar projeto",
            });
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Novo Projeto</DialogTitle>
                    <DialogDescription>
                        Crie um novo projeto para organizar seus ativos digitais. Uma
                        pasta com o mesmo nome será criada automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Marketing Q4 Assets"
                            autoFocus
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="miniDescription">Mini descrição</Label>
                        <Input
                            id="miniDescription"
                            placeholder="Resumo curto do projeto"
                            aria-invalid={!!errors.mini_description}
                            {...register("mini_description")}
                        />
                        {errors.mini_description && (
                            <p className="text-sm text-destructive">
                                {errors.mini_description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            placeholder="Descrição detalhada do projeto"
                            rows={4}
                            className="resize-none"
                            aria-invalid={!!errors.description}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-sm text-destructive">
                            {errors.root.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="cursor-pointer bg-blue-600 hover:bg-blue-800">
                            {isSubmitting && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Criar Projeto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
