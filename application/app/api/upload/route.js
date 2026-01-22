import { bucket } from '../../../lib/gcs';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createOrder } from '../../../services/orders.service';

export async function POST(req) {
  const myFiles = await req.json();


   const orderId = await createOrder(myFiles)


  return NextResponse.json({
    success:true,
    orderId:orderId,
    message:"Files sent to mits store PC "
  });
}
