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
import { useProjectsForm } from "@/hooks/projects/use-projects-form";
import type { CreateProjectFormData } from "@/schemas/projects/projects.schema";
import type { Project } from "@/@types/projects/projects.types";

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void | Promise<void>;
    project?: Project | null;
}

export function NewProjectDialog({
    open,
    onOpenChange,
    onSuccess,
    project,
}: NewProjectDialogProps) {

    const isEditing = project !== null && project !== undefined;
    const { form, loading, handleSubmit } = useProjectsForm(project);

    async function onSubmit(data: CreateProjectFormData) {
        const success = await handleSubmit(data);

        if (!success) return;

        await onSuccess();
        onOpenChange(false);
    };

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) form.reset();
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[50vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Projeto" : "Novo Projeto"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize o nome e as descrições do projeto."
                            : "Crie um novo projeto para organizar seus ativos digitais. Uma pasta com o mesmo nome será criada automaticamente."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2">

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                placeholder={isEditing ? "Nome do projeto" : "Ex: Marketing Q4 Assets"}
                                autoFocus
                                aria-invalid={!!form.formState.errors.name}
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="miniDescription">Mini descrição</Label>
                            <Input
                                id="miniDescription"
                                placeholder={isEditing ? "Atualize o resumo do projeto" : "Resumo curto do projeto"}
                                aria-invalid={!!form.formState.errors.mini_description}
                                {...form.register("mini_description")}
                            />
                            {form.formState.errors.mini_description && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.mini_description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder={isEditing ? "Atualize a descrição do projeto" : "Descrição detalhada do projeto"}
                                rows={4}
                                className="resize-none"
                                aria-invalid={!!form.formState.errors.description}
                                {...form.register("description")}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>

                        {form.formState.errors.root && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={loading}
                                className="cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="cursor-pointer bg-blue-600 hover:bg-blue-800">
                                {loading && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {loading
                                    ? isEditing ? "Salvando..." : "Criando..."
                                    : isEditing ? "Salvar alterações" : "Criar Projeto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
