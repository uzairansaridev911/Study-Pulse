import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from "@clerk/clerk-react";

const Signup = () => {
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  // States
  const [usernameValue, setUsernameValue] = useState(''); // Email ke liye
  const [passwordValue, setPasswordValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const formRef = useRef(null);

  // Animation logic
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
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic Checks
  if (!isLoaded || !signUp) return;
  if (!acceptTerms) return setError("Bhai, terms toh accept kar le pehle!");
  if (loading) return; // Prevent double clicks

  setLoading(true);
  setError("");

  try {
    console.log("Attempting signup for:", usernameValue);

    // 1. Create User - Is step par account "Draft" mode mein chala jata hai
    await signUp.create({
      emailAddress: usernameValue,
      password: passwordValue,
    });

    // 2. Prepare Verification - Yeh actual OTP bhejta hai
     await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    
    console.log("OTP Sent Successfully");

    // 3. Navigation - Ab page change hoga
    navigate("/otp", { 
      state: { type: 'signup', email: usernameValue } 
    });

  } catch (err) {
    console.error("CLERK ERROR:", err);
    const firstError = err?.errors?.[0];
    
    // Yahan agar error 'form_identifier_exists' hai toh matlab account pehle se hai
    setError(firstError?.longMessage || "Signup fail ho gaya. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Side Form */}
      <div className="flex items-center justify-center w-full sm:w-1/2 px-12">
        <div ref={formRef} className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 sm:mb-2 mb-4">Create Account</h1>
          <p className="text-gray-500 mb-8">Please enter your details to SignUp.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                usernameFocused || usernameValue ? '-top-2.5 text-xs bg-white px-2 text-blue-500' : 'top-3.5 text-gray-500'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                passwordFocused || passwordValue ? '-top-2.5 text-xs bg-white px-2 text-blue-500' : 'top-3.5 text-gray-500'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accept the <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
              </label>
            </div>

            {/* Invisible Clerk Captcha Container */}
            <div id="clerk-captcha" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98]"
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account? <Link to='/Login' className="text-blue-500 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Right Side Lottie */}
      <div className="w-1/2 bg-linear-to-br from-blue-500 via-blue-600 to-purple-600 hidden sm:flex items-center justify-center">
        <div className='w-4/5 h-4/5'>
          <DotLottieReact className="h-full w-full" src="https://lottie.host/45e13725-f725-498a-ac15-ce7fe35028ab/zdcJJzHtz2.lottie" loop autoplay />
        </div>
      </div>
    </div>
  );
};

export default Signup;