import React from "react";

type Props = {
  text?: string;
  className?: string; // allow sizing/margins from parent
};

/**
 * Animated, lightweight wordmark. No libraries.
 * - Staggered letter fade/slide-in
 * - Soft breathing glow behind the text
 * - Respects prefers-reduced-motion
 */
export default function AnimatedLogo({ text = "HangInLearn", className = "" }: Props) {
  const letters = Array.from(text);

  return (
    <div className={`relative select-none ${className}`} role="img" aria-label={text}>
      {/* Local keyframes so you don't touch Tailwind config */}
      <style>{`
        @keyframes fadeSlideIn {
          0%   { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes breathGlow {
          0%,100% { opacity: .25; transform: scale(1); }
          50%     { opacity: .45; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-letter { animation: none !important; opacity: 1 !important; transform: none !important; }
          .logo-glow   { animation: none !important; opacity: .25 !important; }
        }
      `}</style>

      {/* Soft glow background */}
      <div
        className="logo-glow absolute -inset-x-6 -inset-y-3 rounded-full blur-2xl
                   bg-gradient-to-r from-[#03A696] via-[#6451CB] to-[#03A696] opacity-30"
        style={{ animation: "breathGlow 4s ease-in-out infinite" }}
        aria-hidden
      />

      {/* Wordmark */}
      <h1 className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-wide">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#03A696] via-[#6451CB] to-[#03A696]">
          {letters.map((ch, i) => (
            <span
              key={i}
              className="logo-letter inline-block"
              style={{
                animation: "fadeSlideIn 600ms ease-out forwards",
                animationDelay: `${i * 60}ms`,
                opacity: 0,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
}
