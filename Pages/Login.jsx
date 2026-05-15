import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// useAuth add kiya hai session check karne ke liye
import { Transition } from './transition';
import { triggerExit } from './transition';
import { useSignIn, useAuth } from "@clerk/clerk-react";

const Login = () => {
  // Clerk Hooks
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth(); // Yeh check karega ke login pehle se hai ya nahi
  const navigate = useNavigate();

  // States
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);
  const rightPanelRef = useRef(null);

  // --- LOGIC: REDIRECT IF ALREADY LOGGED IN ---
  useEffect(() => {
    const handleAutoRedirect = async () => {
      if (isLoaded && isSignedIn) {
        // pehle parda gira ke wait karain
        await triggerExit();
        // phir dashboard pe bhejain
        navigate("/Dashboard");
      }
    };
    handleAutoRedirect();
  }, [isLoaded, isSignedIn, navigate]);

  // Animations
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

  // --- CLERK LOGIN LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    if (!acceptTerms) {
      setError("Please accept the Privacy Policy");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: usernameValue,
        password: passwordValue,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        await triggerExit();

        navigate("/Dashboard");
      } else if (result.status === "needs_first_factor") {
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        navigate("/otp", { state: {type: 'signin'} });
      }
      else if (result.status === "needs_second_factor") {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        navigate("/otp", { state: {type: 'signin'} });
      }
      else{
        setError("Incomplete status: " + result.status)
      }
      
    } catch (err) {
      const clerkError = err?.errors?.[0];
      
      // AGAR SESSION ALREADY EXIST KA ERROR AYE:
      if (clerkError?.code === "session_exists" || err?.status === 403) {
        console.log("Session already exists, redirecting...");
        navigate("/Dashboard");
        return;
      }

      if (clerkError?.code === "invalid_credentials") {
        setError("Wrong username or password");
      } else {
        setError(clerkError?.message || "Something went wrong while signing in");
      }
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center w-full sm:w-1/2 px-12">
        <div ref={formRef} className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 sm:mb-2 mb-4">Welcome Back</h1>
          <p className={`mb-8 ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || 'Please enter your details to sign in'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <label
                htmlFor="username"
                className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                style={{
                  top: usernameFocused || usernameValue ? '-10px' : '16px',
                  fontSize: usernameFocused || usernameValue ? '12px' : '16px',
                  backgroundColor: 'white',
                  padding: '0 8px',
                  color: usernameFocused ? '#10b981' : '#6b7280', // Emerald color to match button
                  zIndex: 10
                }}
              >
                Username / Email address
              </label>
              <input
                id="username"
                type="text"
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label
                htmlFor="password"
                className="absolute left-4 text-gray-500 pointer-events-none transition-all duration-300 ease-out"
                style={{
                  top: passwordFocused || passwordValue ? '-10px' : '16px',
                  fontSize: passwordFocused || passwordValue ? '12px' : '16px',
                  backgroundColor: 'white',
                  padding: '0 8px',
                  color: passwordFocused ? '#10b981' : '#6b7280',
                  zIndex: 10
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to='/ForgottenPassword' size="sm" className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors duration-200">
                Forgot Password?
              </Link>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accept the <span className="text-emerald-500 hover:text-emerald-600 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${loading ? 'bg-emerald-300' : 'bg-emerald-500'} text-white font-semibold rounded-lg hover:bg-emerald-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex justify-center items-center`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to='/Signup' className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors duration-200">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Lottie Panel (Responsive: hidden on mobile, flex on sm up) */}
      <div ref={rightPanelRef} className="w-1/2 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-500 items-center justify-center relative overflow-hidden hidden sm:flex">
        <DotLottieReact
          className='h-130'
          src="https://lottie.host/a43929ba-6c19-4f86-b0f3-cc2182681b27/nSIK4rxg3i.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Transition(Login);