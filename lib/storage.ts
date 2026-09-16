import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"]);
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 50 * 1024 * 1024;

export function storageConfigured() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

function client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

function assertConfigured() {
  if (!storageConfigured()) throw new Error("Object storage is not configured.");
}

export function mediaUrl(key: string) {
  const publicBaseUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
  return publicBaseUrl ? `${publicBaseUrl}/${key}` : `/media/${key}`;
}

function objectKey(originalName: string, mimeType: string) {
  const extension = mimeType === "application/pdf" ? "pdf" : mimeType.split("/")[1];
  const kind = mimeType.startsWith("image/") ? "images" : "documents";
  const now = new Date();
  return `${kind}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${extension}`;
}

export function uploadPolicy(mimeType: string, byteSize: number) {
  const image = mimeType.startsWith("image/");
  return {
    permitted: storageConfigured() && allowedTypes.has(mimeType) && byteSize > 0 && byteSize <= (image ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES),
    kind: (image ? "IMAGE" : "DOCUMENT") as "IMAGE" | "DOCUMENT",
  };
}

export async function uploadObject({
  body,
  key,
  originalName,
  mimeType,
}: {
  body: Uint8Array;
  key?: string;
  originalName: string;
  mimeType: string;
}) {
  assertConfigured();
  const storageKey = key || objectKey(originalName, mimeType);
  await client().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: storageKey,
      Body: body,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: { originalName: encodeURIComponent(originalName) },
    })
  );
  return { key: storageKey, publicUrl: mediaUrl(storageKey) };
}

export async function getObject(key: string) {
  assertConfigured();
  return client().send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}

export async function createUploadUrl(originalName: string, mimeType: string) {
  assertConfigured();
  const key = objectKey(originalName, mimeType);
  const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: mimeType, Metadata: { originalName: encodeURIComponent(originalName) } });
  return { key, uploadUrl: await getSignedUrl(client(), command, { expiresIn: 300 }), publicUrl: mediaUrl(key) };
}
