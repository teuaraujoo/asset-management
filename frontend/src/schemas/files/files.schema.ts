
import { z } from "zod";

// para gerar pre signed url
export const createFileSchema = z.object({
    folder_id: z.string(),
    original_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
    checksum: z.string().length(44)
});

// para completar uplaod apos usar pre sigened url 
export const completeFileUploadSchema = z.object({
    checksum: z.string().length(64)
});

// para extrair informações antes de enviar para a requisicao de pre signed url
export const uploadFileFormSchema = z.object({
    folder_id: z.string().min(1, "Selecione um projeto"),
    file: z.instanceof(File, {
        message: "Selecione um arquivo",
    }),
});

export type CompleteFileUploadBody = z.infer<typeof completeFileUploadSchema>;
export type CreateFileBody = z.infer<typeof createFileSchema>;
export type UploadFileBody = z.infer<typeof uploadFileFormSchema>;