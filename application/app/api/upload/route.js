import { bucket } from '../../../lib/gcs';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createOrder } from '../../../services/orders.service';

export async function POST(req) {
  const formData = await req.formData();

  // 1️⃣ Parse metadata
  const items = JSON.parse(formData.get('items') );

  // 2️⃣ Get files
  const files = formData.getAll('files') 

  if (items.length !== files.length) {
    return NextResponse.json(
      { error: 'Items/files mismatch' },
      { status: 400 }
    );
  }


  const enrichedItems = await Promise.all(
    items.map(async (item, index) => {
      const file = files[index];

      // 🔐 Validation
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDFs allowed');
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `pdfs/${randomUUID()}.pdf`;

      // ⬆️ Upload to GCS
      const gcsFile = bucket.file(fileName);
      await gcsFile.save(buffer, {
        contentType: 'application/pdf',
        resumable: false,
      });

      await gcsFile.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`;
    

      return {
        ...item,
        fileUrl: url,
        originalFileName: file.name,
      };
    })
  );



   await createOrder(enrichedItems)


  return NextResponse.json({
    success:true,
    message:"Files sent to mits store PC "
  });
}
