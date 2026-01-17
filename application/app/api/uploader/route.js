import { NextResponse } from "next/server";
import { bucket } from "../../../lib/gcs";


export  async function POST(req){

    const fileMetaData = await req.json();
     if (!Array.isArray(fileMetaData) || fileMetaData.length === 0) {
    return NextResponse.json({ error: "Invalid files" }, { status: 400 });
  }

  const uploads = await Promise.all(
    fileMetaData.map(async ({ id, type }) => {

      if (type !== "application/pdf") {
        throw new Error("Only PDF allowed");
      }

    const fileName = `pdfs/${id}.pdf`;
     

      const file = bucket.file(fileName);

      const [uploadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 6 * 60 * 1000,
        contentType: type,
      });

      return {
        id,
        uploadUrl,
        fileUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      };
    })
  );
  return NextResponse.json({ uploads });
}



