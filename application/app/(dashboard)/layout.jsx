import { getServerSession } from 'next-auth';
import Navbar from '../../components/Navbar'



 async function layout({children}){

      const session =  await getServerSession();

     if(!session) redirect('/login')
  
        const user = session;
        return <div className='bg-[#f4f4f4] min-h-screen  max-h-fit w-full relative'>
        <Navbar user={user}/>
        {children}
    </div>
}

export default layout;