import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    HeadObjectCommand,
    CopyObjectCommand
} from "@aws-sdk/client-s3";
import s3 from "../../libs/r2-bucket";
import AppError from "../../error/app-error";
export default class StorageService {

    static async generateDownloadPreSignedUrl(key: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        const command = new GetObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: key
        });

        return getSignedUrl(s3, command, {
            expiresIn: 60 * 5 // 5 minutos
        });
    };

    static async generatePreviewUrl(key: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        const command = new GetObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: key
        });

        return getSignedUrl(s3, command, {
            expiresIn: 60 * 2 // 2 minutos
        });
    };

    static async listFolders() {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        return s3.send(
            new ListObjectsV2Command({
                Bucket: process.env.STORAGE_BUCKET
            }),
        );
    };

    static async listObjects(prefix: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        return s3.send(
            new ListObjectsV2Command({
                Bucket: process.env.STORAGE_BUCKET,
                Prefix: prefix,
                Delimiter: "/"
            }),
        );
    };

    static async deleteObject(objectKey: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        return s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.STORAGE_BUCKET,
                Key: objectKey
            }),
        );
    };

    static async getObjectMetaData(objectKey: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        return s3.send(
            new HeadObjectCommand({
                Bucket: process.env.STORAGE_BUCKET,
                Key: objectKey,
                ChecksumMode: "ENABLED",
            })
        );
    };

    static async renameObject(oldKey: string, newKey: string) {
        if (!process.env.STORAGE_BUCKET) throw new AppError("STORAGE_BUCKET não configurado.");

        console.log("CopySource: ", `${process.env.STORAGE_BUCKET}/${oldKey}`)
        await s3.send(new CopyObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            CopySource: `${process.env.STORAGE_BUCKET}/${encodeURIComponent(oldKey)}`,
            Key: newKey
        }));

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: oldKey
        }));
    };

    static async generatePressignedUrl(
        bucket: string,
        objectKey: string,
        mimeType: string,
        checksum: string
    ) {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            ContentType: mimeType,
            ChecksumSHA256: checksum
        });

        const url = await getSignedUrl(s3, command, {
            expiresIn: 60 * 5, // 5 minutos
        });

        return url;
    };

    static async deleteObjectByPrefix(prefix: string) {
        const bucket = process.env.STORAGE_BUCKET;
        if (!bucket) throw new AppError("STORAGE_BUCKET não configurado.");

        const objectKeys: string[] = [];
        let continuationToken: string | undefined;

        do {
            const response = await s3.send(
                new ListObjectsV2Command({
                    Bucket: bucket,
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

            await s3.send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: {
                        Objects: batch.map((key) => ({ Key: key })),
                        Quiet: true
                    },
                }),
            );
        };
    };
};