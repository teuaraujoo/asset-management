import s3 from "../../libs/r2-bucket";
import { StorageProvider } from "../../providers/storage/storage.provider";
import R2StorageProvider from "../../providers/storage/r2storage.provider";

const storageProvider: StorageProvider = new R2StorageProvider(s3, process.env.STORAGE_BUCKET ?? "asset-management");

export async function generateDownloadPreSignedUrl(key: string) {
    return storageProvider.generateDownloadPresignedUrl(key);
};

export async function generatePreviewUrl(key: string) {
    return storageProvider.generatePreviewUrl(key)
};

export async function deleteObject(objectKey: string) {
    return storageProvider.delete(objectKey);
};

export async function getObjectMetaData(objectKey: string) {
    return storageProvider.getObjectMetaData(objectKey);
};

export async function renameObject(oldKey: string, newKey: string) {
    return storageProvider.rename(oldKey, newKey);
};

export async function generatePressignedUrl(
    objectKey: string,
    mimeType: string,
    checksum: string
) {
    return storageProvider.generatePresignedUrl(objectKey, mimeType, checksum);
};

export async function deleteObjectByPrefix(prefix: string) {
    return storageProvider.deleteByPrefix(prefix);
};