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

export interface IStorageProvider {

    delete(
        objectKey: string
    ): Promise<void>;

    deleteByPrefix(
        prefix: string
    ): Promise<unknown>;

    getObjectMetaData(
        objectKey: string
    ): Promise<ObjectMetaData | null>;

    rename(
        oldKey: string,
        newKey: string
    ): Promise<unknown>;

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