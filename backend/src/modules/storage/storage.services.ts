import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, HeadObjectCommand  } from "@aws-sdk/client-s3";
import s3 from "../../libs/r2-bucket";
export default class StorageService {

    private static BUCKET_NAME = "asset-management";

    static async upload(key: string, body: string) {
        return s3.send(
            new PutObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
                Body: body
            }),
        );
    };

    static async download(key: string) {
        return s3.send(
            new GetObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key
            }),
        );
    };

    static async listFolders() {
        return s3.send(
            new ListObjectsV2Command({
                Bucket: this.BUCKET_NAME
            }),
        );
    };

    static async listObjects(prefix: string) {
        return s3.send(
            new ListObjectsV2Command({
                Bucket: this.BUCKET_NAME,
                Prefix: prefix,
                Delimiter: "/"
            }),
        );
    };

    static async deleteObject(objectKey: string) {
        return s3.send(
            new DeleteObjectCommand({
                Bucket: "asset-management",
                Key: objectKey
            }),
        );
    };

    static async getObjectMetaData(objectKey: string) {
        return s3.send(
            new HeadObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: objectKey,
                ChecksumMode: "ENABLED",
            })
        );
    };

    static async generatePressignedUrl(
        bucket: string,
        objectKey: string,
        mimeType: string
    ) {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            ContentType: mimeType,
        });

        const url = await getSignedUrl(
            s3,
            command,
            {
                expiresIn: 60 * 5, // 5 minutos
            }
        );

        return url;
    };
};