import React from "react";

type Props = { onStart: (difficulty: "Easy" | "Medium" | "Hard") => void };

const COLORS: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy:   "bg-green-600 hover:bg-green-700 text-white",
  Medium: "bg-yellow-400 hover:bg-yellow-500 text-neutral-900",
  Hard:   "bg-red-600 hover:bg-red-700 text-white",
};

export default function Start({ onStart }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/*text title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">HangInLearn</h1>

      <p className="opacity-80 text-center max-w-xs -mt-1">
        Choose a difficulty and test your vocabulary.
      </p>

      <div className="w-full max-w-sm grid grid-cols-3 gap-3">
        {(["Easy","Medium","Hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => { navigator.vibrate?.(10); onStart(d); }}
            className={`py-2 rounded-2xl font-semibold shadow active:scale-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${COLORS[d]}`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
