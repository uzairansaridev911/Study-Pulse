import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import book from '../Images/Book.webp'
import Switch from './switch'
import { useNavigate } from "react-router-dom";
import { triggerExit } from "../Pages/transition";
import { Link } from 'react-router-dom'

const Nav = ({setsideopen}) => {

  const imageref = useRef(null);

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


 useEffect(() => {

  if (location.pathname !== '/') return;

  const tl = gsap.timeline();

  tl.fromTo(imageref.current, {
    y: -50,
    opacity: 0
  },{
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 4,
  })

  tl.fromTo('#h2', {
    y: -50,
    opacity: 0
  },{
    y: 0,
    opacity: 1,
    duration: 0.8,
  })
  
  tl.fromTo('#list', {
    y: -50,
    opacity: 0,
  },{
    y: 0,
    stagger: 0.2,
    opacity: 1,
    duration: 0.8,
  })

  tl.fromTo('#button', {
    y: -50,
    opacity: 0,
  },{
    y: 0,
    opacity: 1,
    duration: 0.8,
  })

  gsap.fromTo('#switch', {
    y: -50,
    opacity: 0,
  },{
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 5.6,
  })

}, [location.pathname]);

  return (
    <nav className='w-full bg-white z-30 h-20 fixed flex items-center'>
    <img src={book} alt="" ref={imageref} id='image' className='h-18 w-18 ml-[1.5vw] absolute' />
    <h2 className='font-serif tracking-wider text-2xl sm:ml-27 ml-23' id='h2'>Study Pulse</h2>
    <div className='ml-auto pr-10 items-center gap-4 md:gap-8 lg:gap-12 text-[18px] hidden md:flex'>
      <span onClick={goToHome} className='cursor-pointer' id='list'>Home</span>
      <span onClick={goToAbout} className='cursor-pointer' id='list'>About</span>
      <span onClick={goToServices} className='cursor-pointer' id='list'>Services</span>
      <span onClick={goToContact} className='cursor-pointer' id='list'>Contact</span>
     <button onClick={goToLogin} className='bg-emerald-500 hover:bg-emerald-600 active:scale-97 hover:cursor-pointer w-[8vw] h-9 rounded-[15px]' id='button'>Login</button>
    </div>
    <div className='md:hidden ml-auto pr-5' id='switch'>
      <Switch onClick={() => {setsideopen(prev => !prev)}}/>
    </div>
    </nav>
  )
}

export default Nav