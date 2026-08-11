import fetchRequest from "@/lib/http/client";
import apiRoutes from "@/lib/http/api";
import type { CreateFileBody } from "@/schemas/files/files.schema";

export async function getFilesByFolderiId(folderId: string) {
    return fetchRequest({ method: "GET", url: `${apiRoutes.files}/${folderId}` });
};

export async function createFile(data: CreateFileBody) {
    return fetchRequest({ method: "POST", url: `${apiRoutes.files}/upload-url`, body: data });
};

export async function completeUpload(fileId: string) {
    return fetchRequest({ method: "PUT", url: `${apiRoutes.files}/${fileId}/complete` });
};

export async function uploadToBucket(signedUrl: string, file: File) {

    const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });

    if (!response.ok) throw new Error(`Falha no upload (${response.status})`);

    return true;
};