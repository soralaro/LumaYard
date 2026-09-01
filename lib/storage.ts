import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;

function configured() { return Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_PUBLIC_URL); }
function client() { return new S3Client({ region: process.env.S3_REGION ?? "auto", endpoint: process.env.S3_ENDPOINT, credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } }); }
export function uploadPolicy(mimeType: string, byteSize: number) {
  const image = mimeType.startsWith("image/");
  return {
    permitted: configured() && allowedTypes.has(mimeType) && byteSize > 0 && byteSize <= (image ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES),
    kind: (image ? "IMAGE" : "DOCUMENT") as "IMAGE" | "DOCUMENT",
  };
}
export async function createUploadUrl(originalName: string, mimeType: string) {
  if (!configured()) throw new Error("Object storage is not configured.");
  const extension = mimeType === "application/pdf" ? "pdf" : mimeType.split("/")[1];
  const key = `${mimeType.startsWith("image/") ? "images" : "documents"}/${new Date().getUTCFullYear()}/${String(new Date().getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${extension}`;
  const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: mimeType, Metadata: { originalName: encodeURIComponent(originalName) } });
  return { key, uploadUrl: await getSignedUrl(client(), command, { expiresIn: 300 }), publicUrl: `${process.env.S3_PUBLIC_URL!.replace(/\/$/, "")}/${key}` };
}
