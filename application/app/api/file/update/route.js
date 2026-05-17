import { deleteFromMinio } from "@/lib/deleteFromMinIO";
import { updateOrderStatus } from "../../../../services/orders.service";
import { NextResponse } from "next/server";

export async function POST(req){
    const secretKey = req.headers.get("SECRET_KEY")

    try{

    const body = await req.json();

    // const {SECRET_KEY} = body;
    
    if(secretKey != process.env.SECRET_KEY){
        throw new Error("Invalid secret key");
    }

    //get the array of urls of files here

    const urls = await updateOrderStatus(body)

    if(!urls)
        return NextResponse.json({message:"Updation failed"})
    
    
    //  delete the file from the bucket (GCS)

    console.log("file sec : "+urls)
    await deleteFromMinio(urls)


    return NextResponse.json({message:"FILES DELETED FROM CLOUND !!", updationStatus: true})

    
    }catch(error){
        
        return NextResponse.json({message:"unexpected error occured ",error});

    }
}

