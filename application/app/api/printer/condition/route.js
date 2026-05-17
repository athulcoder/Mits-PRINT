import { getPrinterStatus } from "../../../../services/printer.service";
import { NextResponse } from "next/server";



// THIS IS FOR THE USER TO SEE THE STATUS OF THE PRINTERS 
// IN THE PRINTING CENTER (AVAILABLE OR NOT) BEFORE HE GOES TO THE PRINTING CENTER TO COLLECT HIS PRINTS

export async function GET(req){

    const {searchParams }= new URL(req.url);

    const printerType = searchParams.get('type')

    const printer = await getPrinterStatus(printerType);

    return NextResponse.json({success:true, printer})
    
}