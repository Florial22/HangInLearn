import React from "react";

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
  disabled?: boolean;
  used: Record<string, "hit" | "miss" | undefined>;
  onPick: (letter: string) => void;
};

export default function Keyboard({ disabled, used, onPick }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {KEYS.map((k) => {
        const state = used[k];
        const base =
          "py-2 rounded-lg text-sm font-medium transition active:scale-[.98]";
        const color =
          state === "hit"
            ? "bg-emerald-500 text-white"
            : state === "miss"
            ? "bg-rose-500 text-white"
            : "bg-neutral-800 text-neutral-100 dark:bg-neutral-700 dark:text-neutral-50";
        return (
          <button
            key={k}
            disabled={disabled || !!state}
            onClick={() => onPick(k)}
            className={`${base} ${color} disabled:opacity-40`}
            aria-label={`letter ${k}`}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}
