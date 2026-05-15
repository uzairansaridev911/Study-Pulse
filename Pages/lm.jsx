import React, { useState, useRef, useEffect } from 'react';
import lm1 from '../Images/LM-1.webp';
import lm2 from '../Images/LM-2.webp';
import CO1 from '../Images/CO-1.webp';

const lm = () => {
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const packagesRef = useRef(null);
  const contactLeftRef = useRef(null);
  const contactRightRef = useRef(null);

  useEffect(() => {
    // Hero Animation
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(50px)';
      setTimeout(() => {
        heroRef.current.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transform = 'translateY(0)';
      }, 100);
    }

    // Stats Animation
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-card');
      stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(40px)';
        setTimeout(() => {
          stat.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          stat.style.opacity = '1';
          stat.style.transform = 'translateY(0)';
        }, 300 + index * 150);
      });
    }

    // About Animation
    if (aboutRef.current) {
      aboutRef.current.style.opacity = '0';
      aboutRef.current.style.transform = 'translateX(-50px)';
      setTimeout(() => {
        aboutRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        aboutRef.current.style.opacity = '1';
        aboutRef.current.style.transform = 'translateX(0)';
      }, 500);
    }

    // Services Animation
    if (servicesRef.current) {
      const services = servicesRef.current.querySelectorAll('.service-card');
      services.forEach((service, index) => {
        service.style.opacity = '0';
        service.style.transform = 'scale(0.9)';
        setTimeout(() => {
          service.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          service.style.opacity = '1';
          service.style.transform = 'scale(1)';
        }, 700 + index * 150);
      });
    }

    // Packages Animation
    if (packagesRef.current) {
      const packages = packagesRef.current.querySelectorAll('.package-card');
      packages.forEach((pkg, index) => {
        pkg.style.opacity = '0';
        pkg.style.transform = 'translateY(40px)';
        setTimeout(() => {
          pkg.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          pkg.style.opacity = '1';
          pkg.style.transform = 'translateY(0)';
        }, 900 + index * 150);
      });
    }

    // Contact Animation
    if (contactLeftRef.current) {
      contactLeftRef.current.style.opacity = '0';
      contactLeftRef.current.style.transform = 'translateX(-50px)';
      setTimeout(() => {
        contactLeftRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        contactLeftRef.current.style.opacity = '1';
        contactLeftRef.current.style.transform = 'translateX(0)';
      }, 1100);
    }

    if (contactRightRef.current) {
      contactRightRef.current.style.opacity = '0';
      contactRightRef.current.style.transform = 'translateX(50px)';
      setTimeout(() => {
        contactRightRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        contactRightRef.current.style.opacity = '1';
        contactRightRef.current.style.transform = 'translateX(0)';
      }, 1100);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { fullName, email, message });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">\
        <div className="absolute inset-0 opacity-95">
        <img src={lm1} alt="" className='h-full w-full object-cover' />
        </div>
        
        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">Transform Your Future</h1>
          <p className="text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
            Join thousands of students who have already transformed their careers with our world-class education platform.
          </p>
          <button className="px-10 py-5 bg-linear-to-b from-[#434343] to-[#000000] text-white font-bold text-lg rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-3xl">
            Get Started Today
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div ref={statsRef} className="grid md:grid-cols-4 gap-8">
            <div className="stat-card text-center p-8 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl font-bold text-blue-600 mb-3">5000+</div>
              <div className="text-xl text-gray-700 font-semibold">Active Students</div>
            </div>
            <div className="stat-card text-center p-8 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl font-bold text-emerald-600 mb-3">150+</div>
              <div className="text-xl text-gray-700 font-semibold">Expert Instructors</div>
            </div>
            <div className="stat-card text-center p-8 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl font-bold text-purple-600 mb-3">200+</div>
              <div className="text-xl text-gray-700 font-semibold">Courses Available</div>
            </div>
            <div className="stat-card text-center p-8 bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-5xl font-bold text-orange-600 mb-3">95%</div>
              <div className="text-xl text-gray-700 font-semibold">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div ref={aboutRef}>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">About Our Platform</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <button className="px-8 py-4 bg-[#0A849F] text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 shadow-lg">
                Read Our Story
              </button>
            </div>
            <div className="relative h-96  rounded-3xl overflow-hidden shadow-2xl">
              <img src={lm2} alt="" className='h-full w-full object-cover'/>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-6">What We Offer</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discover our comprehensive range of services.
          </p>
          <div ref={servicesRef} className="grid md:grid-cols-3 gap-8">
            <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 group">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Online Courses</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime Access
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  HD Video Content
                </li>
              </ul>
            </div>

            <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-300 group">
              <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Sessions</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Interactive Classes
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert Mentorship
                </li>
              </ul>
            </div>

            <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300 group">
              <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Industry Recognized
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Career Boost
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-6">Choose Your Package</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Select the perfect plan that fits your learning goals and budget.
          </p>
          <div ref={packagesRef} className="grid md:grid-cols-3 gap-8">
            <div className="package-card bg-white p-10 rounded-3xl shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Basic</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-blue-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access to 10 Courses
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-blue-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Support
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-blue-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Community Access
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-blue-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Monthly Updates
                </li>
              </ul>
              <button className="w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-xl hover:bg-blue-600 transition-colors duration-200">
                Get Started
              </button>
            </div>

            <div className="package-card bg-linear-to-br from-emerald-500 to-teal-500 p-10 rounded-3xl shadow-2xl transform scale-110 relative">
              <div className="absolute top-0 right-0 bg-white text-emerald-600 px-6 py-2 rounded-bl-2xl rounded-tr-3xl text-sm font-bold">
                POPULAR
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">Professional</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$59</span>
                  <span className="text-emerald-100 text-lg">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white text-lg">
                  <svg className="w-6 h-6 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access to All Courses
                </li>
                <li className="flex items-center text-white text-lg">
                  <svg className="w-6 h-6 mr-3 hrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority Support 24/7
                </li>
                <li className="flex items-center text-white text-lg">
                  <svg className="w-6 h-6 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Live Sessions Included
                </li>
                <li className="flex items-center text-white text-lg">
                  <svg className="w-6 h-6 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificates Included
                </li>
              </ul>
              <button className="w-full py-4 bg-white text-emerald-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors duration-200">
                Get Started
              </button>
            </div>

            <div className="package-card bg-white p-10 rounded-3xl shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-purple-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-purple-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1-on-1 Mentorship
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-purple-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom Learning Path
                </li>
                <li className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 text-purple-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Job Placement Support
                </li>
              </ul>
              <button className="w-full py-4 bg-purple-500 text-white font-bold text-lg rounded-xl hover:bg-purple-600 transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Image Placeholder */}
              <div ref={contactLeftRef} className="relative  min-h-96 md:min-h-full flex items-center justify-center">
                <img src={CO1} alt="404" className='h-full w-full object-cover'/>
              </div>

              {/* Right Side - Form */}
              <div ref={contactRightRef} className="p-12 md:p-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-12">Contact Us</h2>

                <div className="space-y-8 mb-12">
                  {/* Full Name */}
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="absolute left-0 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                      style={{
                        top: fullNameFocused || fullName ? '-24px' : '8px',
                        fontSize: fullNameFocused || fullName ? '14px' : '16px',
                        color: fullNameFocused ? '#3b82f6' : '#6b7280'
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFullNameFocused(true)}
                      onBlur={() => setFullNameFocused(false)}
                      className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute left-0 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                      style={{
                        top: emailFocused || email ? '-24px' : '8px',
                        fontSize: emailFocused || email ? '14px' : '16px',
                        color: emailFocused ? '#3b82f6' : '#6b7280'
                      }}
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className="absolute left-0 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                      style={{
                        top: messageFocused || message ? '-24px' : '8px',
                        fontSize: messageFocused || message ? '14px' : '16px',
                        color: messageFocused ? '#3b82f6' : '#6b7280'
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setMessageFocused(true)}
                      onBlur={() => setMessageFocused(false)}
                      className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none bg-transparent"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-blue-500 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Contact Us
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Contact</h3>
                    <a href="mailto:info@mysite.com" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
                      Study955@gmail.com
                    </a>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Based in</h3>
                    <p className="text-gray-600">Karachi</p>
                    <p className="text-gray-600">Pakistan</p>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-900 hover:text-blue-500 transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-900 hover:text-purple-500 transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-900 hover:text-blue-400 transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default lm;