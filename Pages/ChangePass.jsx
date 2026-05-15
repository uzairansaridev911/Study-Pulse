import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useSignIn } from "@clerk/clerk-react"; // Hook import kiya
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { isLoaded, signIn, setActive } = useSignIn(); // Clerk hooks
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error handling ke liye

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    // Basic Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- CLERK PASSWORD RESET LOGIC ---
      const result = await signIn.resetPassword({
        password: formData.newPassword,
      });

      if (result.status === "complete") {
        // Password change ho gaya! Ab session active karke Dashboard bhej do
        await setActive({ session: result.createdSessionId });
        navigate("/Dashboard");
      } else {
        console.log("Status incomplete:", result.status);
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Reset Error:", err);
      setError(err.errors[0]?.longMessage || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      {open ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      )}
    </svg>
  );

  const strength = (() => {
    const p = formData.newPassword;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (p.length < 10) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  })();

  return (
    <div className="min-h-screen flex bg-[#0f172a]">

      {/* ── LEFT — Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">Account Security</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            Change Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
              Password
            </span>
          </h1>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            Choose a strong password to keep your account safe and secure.
          </p>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(71,85,105,0.5)",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(71,85,105,0.5)"}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors">
                  <EyeIcon open={showNew} />
                </button>
              </div>

              {/* Strength bar */}
              {strength && (
                <div className="mt-2.5">
                  <div className="h-1 rounded-full bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${strength.label === "Weak" ? "text-red-400" :
                    strength.label === "Fair" ? "text-yellow-400" :
                      strength.label === "Good" ? "text-blue-400" : "text-emerald-400"
                    }`}>{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Re-enter Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(71,85,105,0.5)",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.6)"}
                  onBlur={e => {
                    const match = formData.newPassword === formData.confirmPassword;
                    e.target.style.borderColor = formData.confirmPassword
                      ? match ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"
                      : "rgba(71,85,105,0.5)";
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1.5 font-medium ${formData.newPassword === formData.confirmPassword ? "text-emerald-400" : "text-red-400"
                  }`}>
                  {formData.newPassword === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 mt-2"
              style={{
                background: loading
                  ? "rgba(16,185,129,0.4)"
                  : "linear-gradient(135deg, #10b981, #06b6d4)",
                color: "#fff",
                boxShadow: loading ? "none" : "0 0 30px rgba(16,185,129,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Updating...
                </span>
              ) : "Update Password"}
            </button>

          </form>
        </div>
      </div>

      {/* ── RIGHT — Empty div for Lottie ── */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>

        {/* Subtle decorative rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{ border: "1px solid rgba(16,185,129,0.06)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ border: "1px solid rgba(16,185,129,0.04)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full"
            style={{ border: "1px solid rgba(16,185,129,0.02)" }} />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
        </div>

        {/* ← Lottie yahan lagana */}
        <div className="flex items-center justify-center w-full h-full min-h-[400px]">
          <div id="lottie-container" className="relative z-10 w-95 h-100">
            <DotLottieReact
              src="https://lottie.host/df49c0d8-eef0-4597-b328-11a07bb06c2e/9QSDsV1hFG.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }} // Animation ko container ke andar fit karne ke liye
            />
          </div>
        </div>
      </div>

    </div>
  );
}