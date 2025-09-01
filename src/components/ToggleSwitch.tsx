import React from "react";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  leftLabel: string;   // e.g., "EN"
  rightLabel: string;  // e.g., "FR"
  tone?: "blue" | "orange";
  constantTrack?: boolean; // <- NEW: keep same color regardless of state
  className?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  tone = "blue",
  constantTrack = false,
  className = "",
}: Props) {
  const trackOn  = tone === "blue" ? "bg-blue-600"   : "bg-orange-500";
  const trackOff = "bg-neutral-900"; // dark/black
  const trackCls = constantTrack ? trackOn : (checked ? trackOn : trackOff);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-28 h-10 rounded-full px-2 select-none transition-colors ${trackCls} ${className}`}
    >
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${checked ? "text-white/70" : "text-white"}`}>
        {leftLabel}
      </span>
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${checked ? "text-white" : "text-white/70"}`}>
        {rightLabel}
      </span>
      <span className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow transition-all ${checked ? "left-[calc(100%-2.75rem)]" : "left-1"}`} />
    </button>
  );
}
