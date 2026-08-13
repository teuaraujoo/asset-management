export type FileItem = {
    id: string;
    folder_id: string | null;
    original_name: string;
    storage_name: string;
    object_key: string;
    bucket: string;
    mime_type: string;
    extension: string;
    size: number;
    checksum: string | null;
    status: "PENDING" | "COMPLETE" | "FAILED";
    created_at: string;
    uploaded_at: string | null;
    updated_at: string;
};
