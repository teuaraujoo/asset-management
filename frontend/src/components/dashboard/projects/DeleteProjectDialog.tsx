import { Loader2 } from "lucide-react";
import type { Project } from "@/@types/projects/projects.types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteProjectDialogProps {
    project: Project | null;
    isDeleting: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
}

export function DeleteProjectDialog({
    project,
    isDeleting,
    onOpenChange,
    onConfirm,
}: DeleteProjectDialogProps) {
    return (
        <Dialog
            open={project !== null}
            onOpenChange={(open) => {
                if (!isDeleting) onOpenChange(open);
            }}
        >
            <DialogContent showCloseButton={!isDeleting}>
                <DialogHeader>
                    <DialogTitle>Excluir projeto</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o projeto
                        {project ? ` "${project.name}"` : ""}? Todos os arquivos vinculados serão excluídos permanentemente.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isDeleting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => void onConfirm()}
                    >
                        {isDeleting && <Loader2 className="size-4 animate-spin" />}
                        {isDeleting ? "Excluindo..." : "Excluir projeto"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
