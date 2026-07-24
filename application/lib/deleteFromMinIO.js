import { getMinioClient } from "./minio";

function parseMinioPublicUrl(fileUrl) {
  try {
    const url = new URL(fileUrl);

    const [, bucket, ...pathParts] = url.pathname.split("/");

    return {
      bucket,
      objectName: pathParts.join("/"),
    };
  } catch {
    return null;
  }
}

export async function deleteFromMinio(fileUrls) {
  if (!process.env.BUCKET_NAME) {
    console.error("MinIO not configured");
    return { success: false };
  }

  const minioClient = getMinioClient();

  await Promise.allSettled(
    fileUrls.map(async ({ fileUrl }) => {
      if (!fileUrl) return;

      try {
        const parsed = parseMinioPublicUrl(fileUrl);
        if (!parsed) return;

        await minioClient.removeObject(
          process.env.BUCKET_NAME,
          parsed.objectName
        );
      } catch (err) {
        console.error("Failed to delete:", fileUrl, err);
      }
    })
  );

  return { success: true };
}

export async function deleteSingleFileFromMinio(fileUrl) {
  if (!process.env.BUCKET_NAME) {
    console.error("MinIO not configured");
    return;
  }

  const minioClient = getMinioClient();

  try {
    const parsed = parseMinioPublicUrl(fileUrl);
    if (!parsed) return;

    await minioClient.removeObject(
      process.env.BUCKET_NAME,
      parsed.objectName
    );
  } catch (err) {
    console.error("Failed to delete:", fileUrl, err);
  }
} 