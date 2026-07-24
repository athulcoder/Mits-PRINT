import { Client } from "minio";

let minioClient = null;

export function getMinioClient() {
  if (minioClient) return minioClient;

  const endPoint = process.env.MINIO_ENDPOINT;

  if (!endPoint) {
    throw new Error("MINIO_ENDPOINT is not configured.");
  }

  minioClient = new Client({
    endPoint,
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  return minioClient;
}