// import { S3Client } from "@aws-sdk/client-s3";
import { PreparedUpload, StorageProvider } from "../storage.provider";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    HeadObjectCommand,
    CopyObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import { ObjectMetaData } from "../storage.provider";
import AppError from "../../../error/app-error";

export default class R2StorageProvider implements StorageProvider {

    constructor(
        private readonly storage: S3Client,
        private readonly bucket: string
    ) {
        if (!bucket) throw new AppError("Storage bucket não configurado", 500);

        this.storage = storage;
        this.bucket = bucket;
    };

    async delete(objectKey: string): Promise<unknown> {

        return this.storage.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: objectKey
            }),
        );
    };

    async deleteByPrefix(prefix: string): Promise<void> {

        const objectKeys: string[] = [];
        let continuationToken: string | undefined;

        do {
            const response = await this.storage.send(
                new ListObjectsV2Command({
                    Bucket: this.bucket,
                    Prefix: prefix,
                    ContinuationToken: continuationToken
                })
            )

            for (const object of response.Contents ?? []) {
                if (object.Key) objectKeys.push(object.Key);
            };

            continuationToken = response.IsTruncated
                ? response.NextContinuationToken
                : undefined

        } while (continuationToken);

        for (let index = 0; index < objectKeys.length; index += 1000) {
            const batch = objectKeys.slice(index, index + 1000);

            await this.storage.send(
                new DeleteObjectsCommand({
                    Bucket: this.bucket,
                    Delete: {
                        Objects: batch.map((key) => ({ Key: key })),
                        Quiet: true
                    },
                }),
            );
        };
    };

    async getObjectMetaData(objectKey: string): Promise<ObjectMetaData> {

        const response = await this.storage.send(
            new HeadObjectCommand({
                Bucket: this.bucket,
                Key: objectKey,
                ChecksumMode: "ENABLED",
            })
        );

        if (response.ContentLength === undefined) throw new AppError("Storage não retornou tamanho do objeto.", 500);

        return {
            contentLength: response.ContentLength,
            contentType: response.ContentType,
            etag: response.ETag,
            checksum: response.ChecksumSHA256
        };
    };

    async rename(oldKey: string, newKey: string): Promise<void> {

        console.log("CopySource: ", `${this.bucket}/${oldKey}`)
        await this.storage.send(new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: `${this.bucket}/${encodeURIComponent(oldKey)}`,
            Key: newKey
        }));

        await this.storage.send(new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: oldKey
        }));
    };

    async generatePresignedUrl(objectKey: string, mimeType: string, checksum: string): Promise<PreparedUpload> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
            ContentType: mimeType,
            ChecksumSHA256: checksum
        });

        const url = await getSignedUrl(this.storage, command, {
            expiresIn: 60 * 5, // 5 minutos
        });

        return {
            uploadUrl: url,
            storageLocation: this.bucket
        };
    };

    async generateDownloadPresignedUrl(key: string): Promise<string> {

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return getSignedUrl(this.storage, command, {
            expiresIn: 60 * 5 // 5 minutos
        });
    };

    async generatePreviewUrl(key: string): Promise<string> {

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return getSignedUrl(this.storage, command, {
            expiresIn: 60 * 2 // 2 minutos
        });
    };
};