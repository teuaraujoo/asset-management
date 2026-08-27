import { z } from "zod";

const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "video/mp4",
] as const;

export const requestFileSchema = z.object({
    folder_id: z.string(),
    original_name: z.string()
        .trim()
        .min(1, "Nome do arquivo obrigatório.")
        .max(255, "Nome do arquivo muito longo."),
    mime_type: z.enum(allowedMimeTypes, {
        message: "Tipo MIME não permitido"
    }),
    size: z.number()
        .int("Tamanho deve ser inteiro.")
        .positive("Arquivo não pode estar vazio.")
        .max(
            1024 * 1024 * 1024,
            "Arquivo excede 1 GiB.",
        ),
    checksum: z.string()
        .regex(
            /^[A-Za-z0-9+/]{43}=$/,
            "Checksum SHA-256 Base64 inválido.")
});

export type PrepareFileUploadDTO = z.infer<typeof requestFileSchema>;

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

export const renameFileSchema = z.object({ name: z.string() });

export type RenameFileDTO = z.infer<typeof renameFileSchema>;
