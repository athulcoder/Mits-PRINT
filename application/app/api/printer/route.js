import { NextResponse } from "next/server";

export async function POST(req){

    
    try{

    const body = await req.json();

    const {SECRET_KEY} = body;


    if(SECRET_KEY != process.env.SECRET_KEY){
        throw e
    }

    const {printerId , printerStatus , printerReason} =body;

    return NextResponse.json({message:"U are a super user" , printerId, printerStatus,printerReason})


    }catch(error){
        
        return NextResponse.json({message:"unexpected error occured "});

    }
}