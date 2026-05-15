import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useState, useRef, useEffect, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

const Forgotten = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
 
  const {isLoaded, signIn} = useSignIn();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Error state for handling the message below "Forgot Password"
  const [errorMessage, setErrorMessage] = useState('');

  const emailLabelRef = useRef(null);
  const phoneLabelRef = useRef(null);
  const formRef = useRef(null);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = '0';
      formRef.current.style.transform = 'translateX(-30px)';
      setTimeout(() => {
        formRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateX(0)';
      }, 100);
    }

    if (rightPanelRef.current) {
      rightPanelRef.current.style.opacity = '0';
      rightPanelRef.current.style.transform = 'translateX(30px)';
      setTimeout(() => {
        rightPanelRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        rightPanelRef.current.style.opacity = '1';
        rightPanelRef.current.style.transform = 'translateX(0)';
      }, 200);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (!isLoaded || loading) return;

    if (!emailValue) {
      setErrorMessage("Please enter your email address first.");
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailValue,
      });

      // Agar success ho jaye toh navigate
      navigate('/otp', { state: { email: emailValue, type: 'forgotten' } });
      
    } catch (err) {
      console.error('Clerk Error:', err);
      // Yahan hum error text ko red karke display karenge
      setErrorMessage(err.errors[0]?.message || "Identity not found. Check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Side - Forgot Password Form */}
      <div className="flex items-center justify-center w-full sm:w-1/2 px-12">
        <div ref={formRef} className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 sm:mb-2 mb-4">Forgot Password</h1>
          <p className={`mb-8 transition-colors duration-300 ${errorMessage ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {errorMessage ? errorMessage : "Enter your details to reset your password"}
            </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email/Username Input */}
            <div className="relative">
              <label
                ref={emailLabelRef}
                htmlFor="email"
                className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                style={{
                  top: emailFocused || emailValue ? '-10px' : '16px',
                  fontSize: emailFocused || emailValue ? '12px' : '16px',
                  backgroundColor: 'white',
                  padding: '0 8px',
                  color: errorMessage ? '#ef4444' : (emailFocused ? '#3b82f6' : '#6b7280')
                }}
              >
                Username / Email Address
              </label>
              <input
                id="email"
                type="text"
                value={emailValue}
                onChange={(e) => {
                    setEmailValue(e.target.value);
                    if(errorMessage) setErrorMessage(''); // Typing shuru karte hi error hata do
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Phone Number Input */}
            <div className="relative">
              <label
                ref={phoneLabelRef}
                htmlFor="phone"
                className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                style={{
                  top: phoneFocused || phoneValue ? '-10px' : '16px',
                  fontSize: phoneFocused || phoneValue ? '12px' : '16px',
                  backgroundColor: phoneFocused || phoneValue ? 'white' : 'transparent',
                  padding: phoneFocused || phoneValue ? '0 8px' : '0',
                  color: phoneFocused ? '#3b82f6' : '#6b7280'
                }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneValue}
                onChange={handlePhoneChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 hover:cursor-pointer active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <a href="#" className="text-yellow-500 hover:text-yellow-600 font-semibold transition-colors duration-200">
               <Link to='/Login'>Sign In </Link>
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Decorative Panel */}
      <div
        ref={rightPanelRef}
        className="w-1/2 bg-linear-to-r from-yellow-400 via-orange-500 to-red-600 items-center justify-center relative overflow-hidden hidden sm:flex"
      >
      <DotLottieReact
      className='h-130'
      src="https://lottie.host/c7e28cc0-f707-412b-ba1a-aaef3effe898/kxDcsnai4g.lottie"
      loop
      autoplay
      />
    
      </div>
    </div>
  );
};

export default Forgotten;