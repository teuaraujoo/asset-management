import { z } from "zod";

export const requestFileSchema = z.object({
    folder_id: z.string(),
    user_id: z.string(),
    originial_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
});

export type requestFileBody = z.infer<typeof requestFileSchema>

export const completeUploadFileSchema = z.object({
    checksum: z.string().length(64)
});

export type completeUploadFileBody = z.infer<typeof completeUploadFileSchema>

export const createFileSchema = z.object({
    user_id: z.string(),
    folder_id: z.string(),
    original_name: z.string(),
    storage_name: z.string(),
    object_key: z.string(),
    bucket: z.string(),
    mime_type: z.string(),
    extension: z.string(),
    size: z.bigint(),
    status: z.string()
});

export type FileSchema = z.infer<typeof createFileSchema>;