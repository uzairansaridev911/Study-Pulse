import React, { useState, useRef, useEffect } from 'react';
import CO1 from '../Images/CO-1.webp';
import { Navigate, useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';
import emailjs from '@emailjs/browser';
import { triggerExit } from './transition';

const Contact = () => {
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    // Left side animation
    if (leftRef.current) {
      leftRef.current.style.opacity = '0';
      leftRef.current.style.transform = 'translateX(-50px)';
      setTimeout(() => {
        leftRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        leftRef.current.style.opacity = '1';
        leftRef.current.style.transform = 'translateX(0)';
      }, 100);
    }

    // Right side animation
    if (rightRef.current) {
      rightRef.current.style.opacity = '0';
      rightRef.current.style.transform = 'translateX(50px)';
      setTimeout(() => {
        rightRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        rightRef.current.style.opacity = '1';
        rightRef.current.style.transform = 'translateX(0)';
      }, 100);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !message) {
    alert("Please fill all fields");
    return;}

   setLoading(true);

   const templateParams = {
    from_name: fullName,
    from_email: email,
    message: message,
  };

  try {
    await emailjs.send(
      'Gmail_Study_Pulse',    // Aapka Service ID
      'template_cgk7msg',   // Aapka Template ID
      templateParams,
      'KTZdsbk3-4SDvlGBw'     // Aapka Public Key
    );

    await triggerExit();

    navigate('/Thanks');
    // Form clear kar dein
    setFullName('');
    setEmail('');
    setMessage('');
  } catch (err) {
    console.error("EmailJS Error:", err);
    alert("Maazrat! Email nahi ja saki.");
  } finally {
    setLoading(false);
  }
  };

  const [sideopen, setsideopen] = useState(false)

  return (
    <>
    <Nav setsideopen={setsideopen}/>
    <Sidebar sideopen={sideopen}/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-8 py-12">
      <div className="max-w-7xl w-full bg-white mt-15 rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Image Placeholder */}
          <div ref={leftRef} className="relative  min-h-96 md:min-h-full flex items-center justify-center">
            <img src={CO1} alt="404" className='h-full w-full object-cover'/>
            {/* Empty div for image placeholder */}
            <div className="w-full h-full"></div>
          </div>

          {/* Right Side - Form */}
          <div ref={rightRef} className="p-12 md:p-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-12">Contact Us</h1>

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
                disabled={loading}
                className="w-full py-4 bg-gray-900 ${loading ? 'bg-gray-400' : 'bg-gray-900'} text-white font-semibold rounded-full hover:bg-blue-500 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? "Sending..." : "Contact Us"}
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Contact</h3>
                <a href="mailto:hi@fashion.com" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
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
    </>
  );
};

export default Contact;