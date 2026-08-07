import fetchRequest from "@/lib/http/client";
import apiRoutes from "@/lib/http/api";
import type { CompleteFileUploadBody, UploadFileBody } from "@/schemas/files/files.schema";

export async function createFile(data: UploadFileBody) {
    return fetchRequest({ method: "POST", url: `${apiRoutes.files}/upload-url`, body: data });
};

export async function completeUpload(fileId: string, data: CompleteFileUploadBody) {
    return fetchRequest({ method: "PUT", url: `${apiRoutes.files}/${fileId}/complete`, body: data });
};