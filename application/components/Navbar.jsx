import React from 'react'
import {CiMenuBurger} from "react-icons/ci"
const Navbar = ({user}) => {
  return (
    <div className='w-full bg-white h-[70px] flex justify-between items-center px-3 shadow-sm shadow-[#a8a8a8] min-lg:px-[200px] ' >
        
        <span className='text-primary-color font-sans text-xl font-bold'>MITS PRINT</span>



       <div className='flex gap-3 items-center'>

         <div className='flex flex-col gap-0 items-end'>
            <p className='font-semibold '>{user.user.name}</p>
            <p className='text-sm font-light ' >{user.user.email}</p>
            
        </div>

      
  {/* <div className='min-lg:hidden'>
            <CiMenuBurger size={26}/>
        </div> */}
    
       </div>

    </div>
  )
}

export default Navbar