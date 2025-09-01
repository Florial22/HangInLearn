import React, { useEffect, useRef, useState } from "react";

export type HangmanCanvasProps = {
  stage: number;            // 0..7
  svgUrl?: string;          // defaults to /assets/hangman/buddy.svg
  className?: string;
};

const ORDER = ["scaffold","head","torso","arm-left","arm-right","leg-left","leg-right","face"];

const cssEscape = (sel: string) =>
  typeof (window as any).CSS !== "undefined" && (window as any).CSS.escape
    ? (window as any).CSS.escape(sel)
    : sel.replace(/[#.:[\],>+/~*^$|=(){}\\]/g, "\\$&");

export default function HangmanCanvas({
  stage,
  svgUrl = "/assets/hangman/buddy.svg",
  className,
}: HangmanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(svgUrl)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((txt) => { if (!cancelled) setSvgMarkup(txt); })
      .catch(() => { if (!cancelled) setSvgMarkup(null); });
    return () => { cancelled = true; };
  }, [svgUrl]);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const svg = root.querySelector("svg") as SVGSVGElement | null;
    if (svg) {
      svg.style.width = "100%";
      svg.style.height = "auto";
      svg.style.background = "transparent";
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

    const foundAny = ORDER.some((id) => root.querySelector(`#${cssEscape(id)}`));
    if (!foundAny) return;

    ORDER.forEach((id, idx) => {
      const node = root.querySelector<SVGElement>(`#${cssEscape(id)}`);
      if (!node) return;
      const show = idx <= stage;
      node.setAttribute(
        "style",
        `display:${show ? "inline" : "none"};transition:opacity .18s ease-out;opacity:${show ? 1 : 0}`
      );
    });
  }, [stage, svgMarkup]);

  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    containerRef.current
      .querySelectorAll('[id*="bg" i], [id*="background" i]')
      .forEach((el) => ((el as SVGGraphicsElement).style.display = "none"));

    const vb = svg.viewBox?.baseVal;
    if (vb && vb.width && vb.height) {
      svg.querySelectorAll("rect").forEach((r) => {
        const fill = (r.getAttribute("fill") || "").toLowerCase();
        const w = Number(r.getAttribute("width"));
        const h = Number(r.getAttribute("height"));
        if (["#fff", "#ffffff", "white"].includes(fill) && w >= vb.width * 0.98 && h >= vb.height * 0.98) {
          (r as SVGRectElement).style.display = "none";
        }
      });
    }
  }, [svgMarkup]);

  if (svgMarkup) {
    return (
      <div
        className={className}
        ref={containerRef}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    );
  }

  // fallback buddy
  return (
    <div className={className} ref={containerRef}>
      <svg viewBox="0 0 360 520" className="w-full h-auto">
        <g id="scaffold"><rect x="0" y="460" width="360" height="60" fill="#e6e6e6" />
          <path d="M90 470 C90 380 90 200 90 120 L230 120" stroke="#7a5d3b" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M230 120 C250 115 265 112 280 108" stroke="#7a5d3b" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <line x1="270" y1="108" x2="270" y2="148" stroke="#7a5d3b" strokeWidth="4" />
          <rect x="248" y="148" width="44" height="22" rx="3" fill="#caa472" />
        </g>
        <g id="head" style={{ display: stage >= 1 ? "inline" : "none" }}>
          <circle cx="200" cy="200" r="22" fill="#ffd7b3" />
        </g>
        <g id="torso" style={{ display: stage >= 2 ? "inline" : "none" }}>
          <rect x="188" y="222" width="24" height="56" rx="8" fill="#5bb8ac" />
        </g>
        <g id="arm-left" style={{ display: stage >= 3 ? "inline" : "none" }}>
          <rect x="170" y="230" width="16" height="8" rx="4" fill="#5bb8ac" />
        </g>
        <g id="arm-right" style={{ display: stage >= 4 ? "inline" : "none" }}>
          <rect x="214" y="230" width="16" height="8" rx="4" fill="#5bb8ac" />
        </g>
        <g id="leg-left" style={{ display: stage >= 5 ? "inline" : "none" }}>
          <rect x="190" y="278" width="8" height="26" rx="4" fill="#6451cb" />
        </g>
        <g id="leg-right" style={{ display: stage >= 6 ? "inline" : "none" }}>
          <rect x="202" y="278" width="8" height="26" rx="4" fill="#6451cb" />
        </g>
        <g id="face" style={{ display: stage >= 7 ? "inline" : "none" }}>
          <circle cx="193" cy="195" r="2" fill="#3b3b3b" />
          <circle cx="207" cy="195" r="2" fill="#3b3b3b" />
          <path d="M195 204 Q200 210 205 204" stroke="#3b3b3b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
