import { getServerSession } from 'next-auth';
import Navbar from '../../components/Navbar'



 async function layout({children}){

      const session =  await getServerSession();

     if(!session) redirect('/login')
  
        const user = session;
        return <div className='bg-[#f7f7f7] h-screen w-full relative'>
        <Navbar user={user}/>
        {children}
    </div>
}

export default layout;