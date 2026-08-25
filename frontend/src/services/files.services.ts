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

export async function deleteFile(fileId: string) {
    return fetchRequest({ method: "DELETE", url: `${apiRoutes.files}/${fileId}` });
};

export async function renameFile(fileId: string, name: string) {
    return fetchRequest({ method: "PATCH", url: `${apiRoutes.files}/${fileId}`, body: { name } });
};

export async function downloadFile(fileId: string) {
    return fetchRequest({ method: "GET", url: `${apiRoutes.files}/${fileId}/download` });
};

export async function getFilePreview(fileId: string) {
    return fetchRequest({ method: "GET", url: `${apiRoutes.files}/${fileId}/preview` });
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

export async function downloadFromBucket(downloadUrl: string, filename: string) {

    const response = await fetch(downloadUrl);

    if (!response.ok) throw new Error("Não foi possível baixar o arquivo.");

    const blob = await response.blob(); // converte resposta em blob

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a"); // cria um <a> invisível para forçar downmlaod
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
};