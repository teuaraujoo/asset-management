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

    const { form, loading, handleCreate } = useProjectsForm();

    async function onSubmit(data: CreateProjectFormData) {
        const success = await handleCreate(data);

        if (!success) return;

        onOpenChange(false);
        onSuccess();
    };

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) form.reset();
        onOpenChange(nextOpen);
    };

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

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Marketing Q4 Assets"
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
                            placeholder="Resumo curto do projeto"
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
                            placeholder="Descrição detalhada do projeto"
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
                            {loading ? "Criando..." : "Criar Projeto"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
