import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
   
    const body = await req.json();

    const {amount} = body;
    console.log(amount)

  const order = await razorpay.orders.create({
    amount:amount, 
    currency: "INR",
    receipt: "order_rcptid_1",
  });

  return NextResponse.json(order);
}