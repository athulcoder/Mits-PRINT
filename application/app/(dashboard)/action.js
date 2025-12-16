

import { getPdfPageCount } from "../../lib/getPagesCount"


export async function handleCancel(onClose){

    onClose()
    
}



export async function calculateAmountServer(files){

    const selectedFiles = await Promise.all(
    files.map( async file=>({
        
            
            pageCount: await getPdfPageCount(file.file),
            color:file.color,
            copies:file.copies,
            doubleSide:file.doubleSide,
            pagesRange:file.pagesRange,
            pagesCustomValue :file.pagesCustomValue

        }
    ))
    )
   

    

    //calculate cost

    let totalCost = 0
     selectedFiles.map(file=>{

        //BLACK_WHITE
        if(file.color==="BLACK_WHITE"){
            let per_page = 150 //1.5 in rupee
            
            if(!file.doubleSide){
                totalCost += per_page*file.pageCount*file.copies

            }
            else{
                totalCost += per_page*file.pageCount*file.copies*2

            }
        }

        //COLOR

        else{
            let per_page = 300 //3  in rupee
            
            if(!file.doubleSide){
                totalCost += per_page*file.pageCount*file.copies

            }
            else{
                totalCost += per_page*file.pageCount*file.copies*2

            }
        }
    })

    totalCost += 200 //extra page

    return totalCost

}




export  async function payMoney(files) {

const formData = new FormData();

// 1️⃣ Extract metadata (WITHOUT files)
const metadata = files.map(({ file, ...rest }) => rest);

// 2️⃣ Append metadata as JSON string
formData.append('items', JSON.stringify(metadata));

// 3️⃣ Append files in SAME ORDER
files.forEach((item) => {
  formData.append('files', item.file);
});


 const res = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});


const data = await res.json();

return data


  
}