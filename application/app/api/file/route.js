import { getOrderfromDB } from "../../../services/orders.service";
import { NextResponse } from "next/server";

//since this is GET request secret key is sent as query parameter and not in the headers of the request
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const SECRET_KEY = searchParams.get("SECRET_KEY");

  if (SECRET_KEY!=process.env.SECRET_KEY)
    return NextResponse.json({error:"you are not auth to get this "})

  

  const orders = await getOrderfromDB()
  

  return NextResponse.json({
    success:true,
    data:orders
  })

}