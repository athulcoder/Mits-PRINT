
import React, { use } from 'react'
import PrintUploader from '../../components/FileUploadCard';

const Homepage = async() => {




  return <section className='flex flex-col  items-center py-3 w-full bg-green-50 h-full'>
    <h1 className='text-xl font-sans'> 
      FILE UPLOAD 
    </h1>


    <PrintUploader/>



  </section>
} 

export default Homepage;