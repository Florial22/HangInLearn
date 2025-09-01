import React from "react";

type LetterSlotsProps = { word: string; guesses: Set<string> };
const isAZ = (c: string) => /^[A-Z]$/.test(c);

export default function LetterSlots({ word, guesses }: LetterSlotsProps) {
  const chars = word.toUpperCase().split("");

  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-3">
      {chars.map((c, i) => {
        if (isAZ(c)) {
          const revealed = guesses.has(c);
          return (
            <div
              key={i}
              className="relative w-12 sm:w-14 h-12 flex items-end justify-center"
              style={{ borderBottom: "2px solid #ffffff" }} // simple straight white line
            >
              {/* letter (reveals on correct guess) */}
              <span
                className={`mb-1 text-2xl font-semibold leading-none transition
                  ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
              >
                {c}
              </span>
              {/* small hyphen BELOW each line to show separation */}
              <span className="absolute -bottom-3 text-white/80 leading-none select-none">-</span>
            </div>
          );
        }

        // spacing for spaces and hyphens in the word (no underline)
        if (c === " ") return <div key={i} className="w-6 sm:w-8 h-12" />;
        if (c === "-")
          return (
            <div key={i} className="w-12 sm:w-14 h-12 flex items-end justify-center">
              <span className="mb-1 text-xl opacity-80">-</span>
            </div>
          );

        return <div key={i} className="w-10 h-12" />;
      })}
    </div>
  );
}
