import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.CLOUDFLARE_ENDPOINT;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 environment variables");
};

// Client S3
const s3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export default s3;