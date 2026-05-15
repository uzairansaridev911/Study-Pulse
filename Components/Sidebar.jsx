import React from 'react'
import {FaBriefcase, FaEnvelope, FaHome, FaInfoCircle, FaPhone, FaTools, FaUser} from 'react-icons/fa'
import book from '../Images/Book.webp'
import { useNavigate } from "react-router-dom";
import { triggerExit } from "../Pages/transition";
import { Link, Links } from 'react-router-dom'
const Sidebar = ({sideopen}) => {

  const navigate = useNavigate();

  const goToLogin = async () => {
    // 1. Parda niche girega
    await triggerExit(); 
    // 2. Jab parda pura gir jaye (resolve ho jaye), tab Login page par le jao
    navigate("/login");
  };
  const goToHome = async () => {
      // 1. Parda niche girega
      await triggerExit(); 
      // 2. Jab parda pura gir jaye (resolve ho jaye), tab Login page par le jao
      navigate("/");
    };
    const goToAbout = async () => {
      // 1. Parda niche girega
      await triggerExit(); 
      // 2. Jab parda pura gir jaye (resolve ho jaye), tab Login page par le jao
      navigate("/About");
    };
    const goToServices = async () => {
      // 1. Parda niche girega
      await triggerExit(); 
      // 2. Jab parda pura gir jaye (resolve ho jaye), tab Login page par le jao
      navigate("/Services");
    };
    const goToContact = async () => {
      // 1. Parda niche girega
      await triggerExit(); 
      // 2. Jab parda pura gir jaye (resolve ho jaye), tab Login page par le jao
      navigate("/Contact");
    };

  return (
    <div className={`h-screen z-50 w-[50vw] bg-white border-r border-black fixed overflow-hidden md:hidden transform transition-transform duration-900 ${sideopen ? 'translate-x-0' : 'translate-x-[-50vw]'}`}>
        <div className='absolute h-[21%] w-full flex flex-wrap  items-center gap-x-4 gap-y-0 px-5 pb-4'>
        <img src={book} alt="log" className='h-18 w-18'/>
        <h2 className='font-serif tracking-wider text-[28px] leading-none'>Study Pulse</h2>
        </div>
      <ul className='space-y-16 sm:space-y-12 font-sans ml-6 mt-50 sm:mt-37 sm:text-2xl'>
        <li onClick={goToHome} className='flex items-center gap-6'> 
          <FaHome size={26} color="black"/> 
          Home
        </li>
        <li onClick={goToAbout} className='flex items-center gap-6'>
          <FaUser size={26} color="black"/>
          About
          </li>
        <li onClick={goToServices} className='flex items-center gap-6'>
          <FaBriefcase size={26} color="black"/>
          Services
          </li>
        <li onClick={goToContact} className='flex items-center gap-6'>
          <FaEnvelope size={26} color="black"/>
          Contact
          </li>
      </ul>    
     <button  onClick={goToLogin} className='bg-blue-400 hover:bg-blue-500 hover:cursor-pointer active:scale-97 w-35 h-11 rounded-[15px] mt-16 ml-4'>Login</button>
    </div>
  )
}

export default Sidebar