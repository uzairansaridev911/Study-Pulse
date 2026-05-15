import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { triggerExit } from './transition';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoaded: signinLoaded, signIn, setActive: setSignInActive_Clerk } = useSignIn();
  const { isLoaded: signupLoaded, signUp, setActive: setSignUpActive_Clerk } = useSignUp();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const formRef = useRef(null);
  const type = location.state?.type || 'signup';
  const rightPanelRef = useRef(null);

  useEffect(() => {
    // Form Animation
    if (formRef.current) {
      formRef.current.style.opacity = '0';
      formRef.current.style.transform = 'translateX(-30px)';
      setTimeout(() => {
        formRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateX(0)';
      }, 100);
    }

    // Right Panel Animation
    if (rightPanelRef.current) {
      rightPanelRef.current.style.opacity = '0';
      rightPanelRef.current.style.transform = 'translateX(30px)';
      setTimeout(() => {
        rightPanelRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        rightPanelRef.current.style.opacity = '1';
        rightPanelRef.current.style.transform = 'translateX(0)';
      }, 200);
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex].focus();
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || loading) return;

    setLoading(true);
    setError('');

    try {
      if (type === 'signup') {
        const result = await signUp.attemptEmailAddressVerification({ code: otpValue });
        
        if (result.status === 'complete') {
          // 1. Session active karo aur uska wait karo
          await setSignUpActive_Clerk({ session: result.createdSessionId });
          
          
          await triggerExit();


          // 2. Chota sa delay (500ms) taaki browser session ko "hazam" kar le
          navigate('/Dashboard');
        } else {
          setError("Verification incomplete. Status: " + result.status);
        }
      } 
      else if (type === 'forgotten') {
        // --- FORGOTTEN PASSWORD LOGIC ---
        // Clerk mein forgotten password ka OTP 'attemptFirstFactor' se verify hota hai
        const result = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code: otpValue,
        });

        if (result.status === 'needs_new_password') {
          // OTP sahi hai, ab password change karne bhej do
          await triggerExit();
          navigate('/Change_Password'); 
        } else {
          setError("Verification failed. Status: " + result.status);
        }
      }
      else {
        const result = await signIn.attemptSecondFactor({ strategy: 'email_code', code: otpValue });
        if (result.status === 'complete') {
          await setSignInActive_Clerk({ session: result.createdSessionId });

            await triggerExit();

          navigate('/Dashboard');
        }
      }
    } catch (err) {
      console.error("OTP Error Object:", err);
      
      // Agar pehle hi verify ho chuka hai toh foran bhej do
      const errorCode = err.errors?.[0]?.code;
      if (errorCode === "already_verified" || errorCode === "session_exists") {
        window.location.assign('/Dashboard');
      } else {
        setError(err?.errors?.[0]?.longMessage || "Wrong OTP. Please try again.");
      }
    } finally {
      // Foran loading false mat karo agar redirect ho raha hai
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'signup') {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } 
      else if (type === 'forgotten') {
        // Forgotten password ke liye resend logic
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: location.state?.email, // Forgotten page se jo email aaya tha
        });
      }
      else {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      setError('OTP sent again!'); // User ko batane ke liye
    } catch (err) {
      setError("Resend fail ho gaya. Wait a minute.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Side - OTP Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-12">
        <div ref={formRef} className="w-full max-w-md">
          <h1 className="text-4xl font-bold ml-13 text-gray-900 sm:mb-2 mb-4">Verify Your Account</h1>
          <p className="text-gray-500 mb-4">
            We've sent a 6-digit code to your email. Please enter it below.
          </p>
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}

          <div className="mb-8">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="md:w-12 w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-400"
                  style={{
                    backgroundColor: digit ? '#f0f9ff' : 'white',
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || otp.join('').length !== 6} //use loading here
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200 hover:underline"
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Empty for Lottie Animation */}
      <div
        ref={rightPanelRef}
        className="w-1/2 bg-linear-to-br from-blue-500 via-blue-600 to-purple-600 items-center justify-center relative overflow-hidden hidden md:flex"
      >
        {/* Empty div for Lottie animation */}
        <div className="w-full h-full flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/e2995703-979b-4753-88bf-6591283bbbed/AXwgA374yh.lottie"
            loop
            autoplay className='h-125 w-133' />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;