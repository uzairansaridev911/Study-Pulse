import React, { useState, useEffect } from 'react' // useEffect add kiya
import Loader from '../Components/Loader'
import Nav from '../Components/Nav'
import Sidebar from '../Components/Sidebar'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Link, useNavigate } from 'react-router-dom' // useNavigate add kiyaz
import { useAuth } from "@clerk/clerk-react" // useAuth add kiya
import { triggerExit } from './transition'

const Home = () => {
  const [sideopen, setsideopen] = useState(false)
  
  // Clerk setup for auto-redirect
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const gotoSignup = async () => {

   await triggerExit();

   navigate('/Signup')
   
  }

  const gotoLm = async () => {

   await triggerExit();

   navigate('/Learnmore')

  }

  useEffect(() => {
    // Agar session mil jata hai, toh seedha dashboard bhejo
    if (isLoaded && isSignedIn) {
      navigate('/Dashboard') // Yahan apna dashboard path check kar lein agar change hai toh
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Jab tak Clerk background mein session check kar raha hai, 
  // hum Loader dikhayenge taake layout jump na kare
  if (!isLoaded) {
    return <Loader />;
  }


  return (
    <div>
      <Loader />
      <Nav setsideopen={setsideopen} />
      <Sidebar sideopen={sideopen}/>
      <div className='h-[calc(100vh)] w-full md:pb-5 flex flex-col items-center text-center justify-center'>
        <DotLottieReact className='h-50' src="https://lottie.host/c72d6b9c-f5f9-4869-8312-f70a4eb5c36c/skyNoUpw54.lottie" loop autoplay/>
         <h1 className='text-black text-[45px] md:text-[55px] font-bold'>Learn Better, Study Smarter</h1>
         <h1 className='text-black text-[24px] md:text-[27px] pt-2'>A modern platform designed for students who want to grow, focus, and succeed</h1>
         
         <div className='flex gap-x-5'>
           {/* Agar user logged in nahi hai, tabhi ye buttons kaam ayenge */}
           
             <button onClick={gotoSignup} className='bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer active:scale-97 w-40 h-11 rounded-[15px] font-semibold mt-8'>
               Create Account
             </button>
           
           
             <button onClick={gotoLm} className='bg-gray-300 hover:bg-gray-400 hover:cursor-pointer active:scale-97 w-40 h-11 rounded-[15px] font-semibold mt-8 text-black'>
               Learn more -{`>`}
             </button>
           
         </div>
      </div>
    </div>
  )
}

export default Home