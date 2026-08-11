// import type { UploadForm } from "@/@types/projects/projects.types";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Loader2 } from "lucide-react";
import { useUploadFileForm } from "@/hooks/files/use-upload-file-form";
import type { UploadFileBody } from "@/schemas/files/files.schema";
import { Controller } from "react-hook-form";
import { completeUpload, uploadToBucket } from "@/services/files.services";
// import { calculateChecksum } from "@/utils/calculate-checksum";
import { UploadStatus, type UploadState } from "./UploadStatus";
import toast from "react-hot-toast";

type Project = {
  id: string;
  folder_id: string;
  name: string;
};

interface UploadFileDialogProps {
  projects: Project[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadFileDialog({
  projects,
  open,
  onOpenChange,
}: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [randomId] = useState(() => crypto.randomUUID());

  const { form, loading, prepareUpload } = useUploadFileForm();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setFile(null);
      form.reset({
        folder_id: "",
        file: undefined,
      });
    };

    onOpenChange(nextOpen);
  };

  function updateUploadToast(toastId: string, state: UploadState) {
    toast.custom(
      () => <UploadStatus state={state} />,
      {
        id: toastId,
        position: "bottom-right",
        duration: state.status === "completed" || state.status === "error"
          ? 5000
          : Infinity,
      },
    );
  };

  async function onSubmit(body: UploadFileBody) {
    if (!file) return;

    let uploadToastId: string | undefined;

    try {
      const upload = await prepareUpload(body);

      if (!upload) return;

      handleOpenChange(false);

      uploadToastId = `file-upload-${randomId}`;
      updateUploadToast(uploadToastId, {
        status: "uploading",
        progress: 0,
      });

      await uploadToBucket(upload.data.uploadUrl, file);

      updateUploadToast(uploadToastId, {
        status: "processing",
        progress: 100,
      });

      // const checksum = await calculateChecksum(file);

      await completeUpload(upload.data.file_id);

      updateUploadToast(uploadToastId, {
        status: "completed",
        progress: 100,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível finalizar o upload.";

      if (uploadToastId) {
        updateUploadToast(uploadToastId, {
          status: "error",
          message,
        });
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Enviar arquivo</DialogTitle>

            <DialogDescription>
              Escolha um projeto e envie um arquivo para ele.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Projeto */}

            <Controller
              control={form.control}
              name="folder_id"
              render={({ field, fieldState }) => {
                const selectedProject = projects.find(
                  (project) => project.folder_id === field.value,
                );

                return (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Projeto
                    </label>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Selecione um projeto">
                          {selectedProject?.name}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem
                            key={project.id}
                            value={project.folder_id}
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* Arquivo */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Arquivo
              </label>

              <Controller
                control={form.control}
                name="file"
                render={({ field }) => (
                  <Input
                    type="file"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;

                      setFile(selectedFile);
                      field.onChange(selectedFile);
                    }}
                  />
                )}
              />

              {file && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {file.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}
              {form.formState.errors.file && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.file.message}
                </p>
              )}
            </div>
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <DialogFooter className="mt-8">
            <Button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-blue-600"
            >
              {loading && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {loading ? "Preparando..." : "Enviar arquivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}