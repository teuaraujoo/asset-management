import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, HeadObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../libs/r2-bucket";
export default class StorageService {

    private static BUCKET_NAME = "asset-management";

    static async generateDownloadPreSignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: key
        });

        return getSignedUrl(s3, command, {
            expiresIn: 60 * 5
        });
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

    static async renameOnject(oldKey: string, newKey: string) {
        console.log("CopySource: ", `${this.BUCKET_NAME}/${oldKey}`)
        await s3.send(new CopyObjectCommand({
            Bucket: this.BUCKET_NAME,
            CopySource: `${this.BUCKET_NAME}/${encodeURIComponent(oldKey)}`,
            Key: newKey
        }));

        await s3.send(new DeleteObjectCommand({
            Bucket: this.BUCKET_NAME,
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