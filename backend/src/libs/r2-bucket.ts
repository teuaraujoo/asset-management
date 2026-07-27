import "dotenv/config";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.CLOUDFLARE_ENDPOINT;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 environment variables");
}

// Client S3
const s3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export default class Bucket {

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
};