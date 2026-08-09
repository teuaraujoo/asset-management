
import { z } from "zod";

// para requisicao da api
export const createFileSchema = z.object({
    folder_id: z.string(),
    original_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
});

// segunda requisicao pos usar signed url
export const completeFileUploadSchema = z.object({
    checksum: z.string().length(64)
});

// para extrair informações antes de enviar para a api
export const uploadFileFormSchema = z.object({
    folder_id: z.string().min(1, "Selecione um projeto"),
    file: z.instanceof(File, {
        message: "Selecione um arquivo",
    }),
});

export type CompleteFileUploadBody = z.infer<typeof completeFileUploadSchema>;
export type CreateFileBody = z.infer<typeof createFileSchema>;
export type UploadFileBody = z.infer<typeof uploadFileFormSchema>;