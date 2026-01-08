
"use client"
import {signIn} from "next-auth/react"
import Image from 'next/image'
import React, { useState } from 'react'
import DotLoader from "../../components/DotLoader";

const RestPassword = () => {


    
    const [error, setError] = useState();
    const [load, setLoad] = useState(false);
    async function handleSubmit(e) {
    setLoad(true)
    e.preventDefault();

    const form = e.currentTarget;
    const res = await signIn("credentials", {
      email: form.email.value,
      password: form.password.value,
      redirect:false,
      callbackUrl: '/',
    });

    if (res?.error) {
      setError("Invalid credentails entered")
      setLoad(false);
    } else {
        setLoad(false)
        window.location.href = res.url ?? "/";

    }

  }



  return (
    <section className='bg-200 bg-white-600 h-screen w-full flex flex-col items-center justify-center min-lg:flex-row'>
        



        <form onSubmit={handleSubmit} className='w-[90%] max-w-[660px] h-[300px] bg-secondary-color shadow-gray-400 shadow-lg rounded-2xl py-6 flex flex-col '>

            
            <span className='text-2xl text-center w-full text-foreground font-semibold text-xl'> Reset Password</span>
            {/* EMAIL */}
            <div className='w-full h-[80px] flex flex-col px-6 gap-3 mb-6' >
            <label className='text-text-primary-color   text-lg'>College mail: </label>
            <input type="email" className='border-1 border-gray-400 h-[50px] p-2 text-lg rounded-lg outline-0 focus:border-2 focus:border-green-500' placeholder='student email'   required autoComplete='college-email' name='email'/>
            </div>

           

                <p className="py-1 px-8 text-red-500 font-medium text-left h-[30px]">{"  "} {error}</p>

              
        
            <div className='flex items-center justify-center w-full px-6 '>
                <button type='submit' className='bg-green-600 text-white h-[50px] w-full cursor-pointer rounded-xl text-xl -semibold hover:bg-green-500  transition-all delay-75 flex justify-center items-center' > {load? <DotLoader/> :"Send OTP"}</button>
            </div>

            
        </form>
     
    </section>
  )
  
}

export default RestPassword;