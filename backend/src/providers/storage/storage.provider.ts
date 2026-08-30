export interface ObjectMetaData {
    contentLength: number;
    contentType?: string;
    etag?: string;
    checksum?: string;
};

export interface PreparedUpload {
    uploadUrl: string;
    storageLocation: string;
};

export interface IFileStorage {

    delete(
        objectKey: string
    ): Promise<void>;

    getObjectMetaData(
        objectKey: string
    ): Promise<ObjectMetaData | null>;

    rename(
        oldKey: string,
        newKey: string
    ): Promise<void>;

    generatePresignedUrl(
        objectKey: string,
        mimeType: string,
        checksum: string
    ): Promise<PreparedUpload>;

    generateDownloadPresignedUrl(
        key: string
    ): Promise<string>;

    generatePreviewUrl(
        key: string
    ): Promise<string>;
};
export interface IProjectStorageCleaner {
    deleteByPrefix(
        prefix: string
    ): Promise<void>;
};