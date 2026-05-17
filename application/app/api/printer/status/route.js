import { updatePrinterStatus } from "../../../../services/printer.service";
import { NextResponse } from "next/server";


// THIS IS IS FOR STORE PC TO UPDATE
//  THE STATUS OF THE PRINTERS IN THE PRINTING CENTER (AVAILABLE OR NOT) 
// AFTER USER CHECKS THE PRINTERS AND GOES TO THE PRINTING CENTER TO COLLECT HIS PRINTS
export async function POST(req){
    const secretKey = req.headers.get("SECRET_KEY")
    
    try{

    const body = await req.json();

    // const {SECRET_KEY} = body;


    if(secretKey != process.env.SECRET_KEY){
        throw new Error("Invalid secret key");
    }

    const res = await updatePrinterStatus(body)

    if(!res)
        return NextResponse.json({message:"Updation failed"})
    
    
    return NextResponse.json({message:"Updation Successfull", updationStatus: true})

    
    }catch(error){
        
        return NextResponse.json({message:"unexpected error occured "});

    }
}

