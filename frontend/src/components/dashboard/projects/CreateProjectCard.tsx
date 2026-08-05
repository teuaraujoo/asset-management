import { Plus } from "lucide-react";

interface CreateProjectCardProps {
  onClick: () => void;
}

export function CreateProjectCard({ onClick }: CreateProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer flex min-h-[196px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-transparent p-5 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-accent/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex size-11 items-center justify-center rounded-full border border-dashed border-current">
        <Plus className="size-5" />
      </div>
      <span className="text-sm font-medium">Criar Novo Projeto</span>
    </button>
  );
}