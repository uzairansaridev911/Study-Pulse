import { useEffect, useState } from "react";

export default function Thanks() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0f172a] flex items-center justify-center overflow-hidden px-4">

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 max-w-md w-full text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
        }}
      >

        {/* Icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.25)",
            boxShadow: "0 0 0 10px rgba(16,185,129,0.05), 0 0 0 20px rgba(16,185,129,0.025)",
          }}
        >
          <svg
            className="w-9 h-9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        {/* Label */}
        <p className="text-[#10b981] text-[0.7rem] font-medium tracking-[0.25em] uppercase mb-4">
          Message Sent
        </p>

        {/* Heading */}
        <h1
          className="text-[#f1f5f9] font-serif text-4xl sm:text-5xl leading-tight mb-5"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          We've got your{" "}
          <span className="italic text-[#6ee7b7]">message.</span>
        </h1>

        {/* Body */}
        <p className="text-[#475569] text-sm font-light leading-relaxed max-w-[320px] mx-auto mb-8">
          Thank you for reaching out. Our team will review your message
          and get back to you as soon as possible.
        </p>

        {/* Divider */}
        <div
          className="mx-auto mb-8 h-px w-10"
          style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#6ee7b7] text-xs font-light tracking-wide"
          style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.18)",
          }}
        >
          {/* Pulsing dot */}
          <span className="relative flex h-[6px] w-[6px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60" />
            <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#10b981]" />
          </span>
          Usually replies within 24 hours
        </div>

      </div>
    </div>
  );
}