import React, { useRef, useEffect, useState } from 'react';
import graduate from '../Images/Graduate.webp';
import AB1 from '../Images/AB-1.webp';
import AB2 from '../Images/AB-2.webp';
import AB3 from '../Images/AB-3.webp';
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';
import { Link } from 'react-router-dom';


const About = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    // Hero Animation
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        heroRef.current.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transform = 'translateY(0)';
      }, 100);
    }

    // Story Section Animation
    if (storyRef.current) {
      storyRef.current.style.opacity = '0';
      storyRef.current.style.transform = 'translateX(-50px)';
      setTimeout(() => {
        storyRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        storyRef.current.style.opacity = '1';
        storyRef.current.style.transform = 'translateX(0)';
      }, 300);
    }

    // Mission Section Animation
    if (missionRef.current) {
      missionRef.current.style.opacity = '0';
      missionRef.current.style.transform = 'translateX(50px)';
      setTimeout(() => {
        missionRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        missionRef.current.style.opacity = '1';
        missionRef.current.style.transform = 'translateX(0)';
      }, 500);
    }

    // Values Animation
    if (valuesRef.current) {
      const cards = valuesRef.current.querySelectorAll('.value-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 700 + index * 150);
      });
    }

  }, []);

   const [sideopen, setsideopen] = useState(false)

  return (
    <>
    <Nav setsideopen={setsideopen} />
    <Sidebar sideopen={sideopen}/>
    <div className="min-h-screen overflow-y-scroll no-scrollbar bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-90">
            <img src={graduate} alt="" className='h-full w-full object-cover'/>
        </div>
        
        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-8 py-35 text-center">
            
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Our Institute</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We are committed to empowering students through quality education, innovative learning methods, and a supportive academic environment that helps them achieve their goals.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={storyRef}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We believe in creating an environment where learning goes beyond textbooks and encourages curiosity, creativity, and personal growth. Our approach focuses on building strong foundations while nurturing confidence and critical thinking skills.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With experienced mentors, modern resources, and a student-centered culture, we aim to prepare individuals for real-world challenges. Our commitment is to guide learners toward success through knowledge, discipline, and continuous improvement.
            </p>
          </div>
          <div className="relative h-96  rounded-2xl overflow-hidden shadow-xl ">
            <img src={AB1} alt="" className='h-full w-full object-cover'/>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img src={AB2} alt="404" className='h-full w-full object-cover'/>
            </div>
            <div ref={missionRef} className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div ref={valuesRef} className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="value-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
            </p>
          </div>

          <div className="value-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
            </p>
          </div>

          <div className="value-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
            </p>
          </div>
        </div>
      </div>

      

      {/* CTA Section */}
      <div className=" overflow-hidden sm:h-70 h-95 " style={{
        backgroundImage: `url(${AB3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mt-9">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mt-5">
            Join us today and start achieving your goals with the right tools and support.
          </p>
          
          <Link to='/Signup'>
          <button className="px-8 py-4 mt-5 bg-black text-amber-400 font-semibold rounded-lg hover:bg-gray-950 hover:cursor-pointer active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl">
            Create Account
          </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;