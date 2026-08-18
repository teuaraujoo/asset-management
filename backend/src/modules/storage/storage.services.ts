import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, HeadObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../libs/r2-bucket";
export default class StorageService {

    static async generateDownloadPreSignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: key
        });

        return getSignedUrl(s3, command, {
            expiresIn: 60 * 5
        });
    };

    static async listFolders() {
        return s3.send(
            new ListObjectsV2Command({
                Bucket: process.env.STORAGE_BUCKET
            }),
        );
    };

    static async listObjects(prefix: string) {
        return s3.send(
            new ListObjectsV2Command({
                Bucket: process.env.STORAGE_BUCKET,
                Prefix: prefix,
                Delimiter: "/"
            }),
        );
    };

    static async deleteObject(objectKey: string) {
        return s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.STORAGE_BUCKET,
                Key: objectKey
            }),
        );
    };

    static async getObjectMetaData(objectKey: string) {
        return s3.send(
            new HeadObjectCommand({
                Bucket: process.env.STORAGE_BUCKET,
                Key: objectKey,
                ChecksumMode: "ENABLED",
            })
        );
    };

    static async renameOnject(oldKey: string, newKey: string) {
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
};