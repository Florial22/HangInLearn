import React, { useState } from "react";
import { useSettings } from "../state/settings";
import ToggleSwitch from "../components/ToggleSwitch";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

type Props = { onStart: (difficulty: "Easy" | "Medium" | "Hard") => void };

const DIFFICULTY_COLORS: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy:   "bg-green-600 hover:bg-green-700 text-white",
  Medium: "bg-yellow-400 hover:bg-yellow-500 text-neutral-900",
  Hard:   "bg-red-600 hover:bg-red-700 text-white",
};

export default function Start({ onStart }: Props) {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] relative flex flex-col items-center justify-center gap-6 p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Settings button top-left */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Settings"
        title="Settings"
        className="absolute left-3 top-3 size-10 flex items-center justify-center rounded-xl
                    border border-neutral-300 dark:border-neutral-700
                    bg-white/80 dark:bg-neutral-900/80 backdrop-blur
                    hover:bg-white dark:hover:bg-neutral-900
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
        <Cog6ToothIcon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
      </button>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">HangInLearn</h1>

      <p className="opacity-80 text-center max-w-xs -mt-1">
        Choose a difficulty and text your vocabulary.
      </p>

      {/* Difficulty buttons */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-3">
        {(["Easy","Medium","Hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => { navigator.vibrate?.(10); onStart(d); }}
            className={`py-3 rounded-2xl font-semibold shadow active:scale-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${DIFFICULTY_COLORS[d]}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Settings modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 p-5 border border-neutral-200/60 dark:border-neutral-800/60">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            {/* Language toggle: EN (left / dark) ↔ FR (right / bright) */}
            <div className="mb-5">
              <div className="text-sm font-medium mb-2">Language</div>
              <ToggleSwitch
                leftLabel="EN"
                rightLabel="FR"
                tone="blue"
                constantTrack   // <- keep the blue track regardless of EN/FR
                checked={settings.lang === "fr"}
                onChange={(v) => setSettings((s) => ({ ...s, lang: v ? "fr" : "en" }))}
                />
            </div>

            {/* Sound toggle: OFF (left / dark) ↔ ON (right / bright) */}
            <div className="mb-2">
              <div className="text-sm font-medium mb-2">Sound</div>
              <ToggleSwitch
                leftLabel="OFF"
                rightLabel="ON"
                tone="orange"      
                constantTrack     
                checked={settings.sound}
                onChange={(v) => setSettings((s) => ({ ...s, sound: v }))}
                />
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
