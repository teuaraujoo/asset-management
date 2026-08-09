import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type UploadState =
  | { status: "idle"; progress: 0 }
  | { status: "preparing"; progress: 0 }
  | { status: "uploading"; progress: number }
  | { status: "processing"; progress: 100 }
  | { status: "completed"; progress: 100 }
  | { status: "error"; message: string };

interface UploadStatusProps {
  state: UploadState;
}

const statusLabels = {
  preparing: "Preparando o upload...",
  uploading: "Enviando arquivo...",
  processing: "Processando arquivo...",
  completed: "Upload concluído.",
} as const;

export function UploadStatus({ state }: UploadStatusProps) {
  if (state.status === "idle") return null;

  if (state.status === "error") {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        <span>{state.message}</span>
      </div>
    );
  }

  if (state.status === "completed") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>{statusLabels.completed}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Loader2 className="size-4 animate-spin" />
        <span>{statusLabels[state.status]}</span>
        <span className="ml-auto text-muted-foreground">{state.progress}%</span>
      </div>
      <Progress value={state.progress} aria-label={statusLabels[state.status]} />
    </div>
  );
}
