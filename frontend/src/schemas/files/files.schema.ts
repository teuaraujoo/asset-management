
import { z } from "zod";

export const requestUploadFileSchema = z.object({
    folder_id: z.string(),
    originial_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
});

export const completeFileUploadSchema = z.object({
    checksum: z.string().length(64)
});

export type CompleteFileUploadBody = z.infer<typeof completeFileUploadSchema>;
export type UploadFileBody = z.infer<typeof requestUploadFileSchema>;