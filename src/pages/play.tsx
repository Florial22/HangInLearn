import React, { useEffect, useMemo, useRef, useState } from "react";
import HangmanCanvas from "../components/HangmanCanvas";
import confetti from "canvas-confetti";


type Difficulty = "Easy" | "Medium" | "Hard";
type WordItem = {
  id: string;
  word: string;
  definition?: string;
  hintText?: string;
  difficulty?: Difficulty;
};
export type PlayProps = { difficulty: "Easy" | "Medium" | "Hard"; onExit: () => void };

const maxMisses = 6;

// Build a dashed view like "— — — — —", replacing with letters when guessed
function dashedMask(word: string, guesses: Set<string>) {
  return word
    .toUpperCase()
    .split("")
    .map((c) => {
      if (/^[A-Z]$/.test(c)) return guesses.has(c) ? c : "—"; // em dash
      if (c === " ") return " "; // keep space (join adds extra space around it)
      return c; // keep hyphens or punctuation
    })
    .join(" ");
}

export default function Play({ difficulty, onExit }: PlayProps) {
  const [pack, setPack] = useState<WordItem[]>([]);
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const winSfxRef = useRef<HTMLAudioElement | null>(null);
  const loseSfxRef = useRef<HTMLAudioElement | null>(null);


  const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
      const v = window.visualViewport;
      if (!v) return; // older Android browsers
      const onResize = () => {
        const keyboardHeight = window.innerHeight - v.height;
        setKeyboardOpen(keyboardHeight > 120); // ~ threshold in px
      };
      v.addEventListener("resize", onResize);
      v.addEventListener("scroll", onResize);
      onResize();
      return () => {
        v.removeEventListener("resize", onResize);
        v.removeEventListener("scroll", onResize);
      };
    }, []);

  // Load local words
  useEffect(() => {
    fetch("/assets/words/custom_words.json")
      .then((r) => r.json())
      .then((data) => setPack(data.words))
      .catch(() => setPack([{ id: "fallback", word: "apple" }]));
  }, []);

    // Play win sound + confetti
    useEffect(() => {
    const a = new Audio("/sfx/win.mp3");
    a.preload = "auto";
    a.volume = 0.6;
    winSfxRef.current = a;
      }, []);


      useEffect(() => {
        const a = new Audio("/sfx/loss.mp3");
        a.preload = "auto";
        a.volume = 0.6;
        loseSfxRef.current = a;
      }, []);


  // Filter words by difficulty
  const filtered = useMemo(() => {
    if (!pack.length) return [];

    // primary: filter by explicit difficulty field
    const byDifficulty = pack.filter(w => (w.difficulty ?? "Medium") === difficulty);
    if (byDifficulty.length) return byDifficulty;

    // fallback: old length-based ranges (if some words lack difficulty)
    const len = (w: string) => w.replace(/[^A-Za-z]/g, "").length;
    const [min, max] =
      difficulty === "Easy" ? [3, 5] :
      difficulty === "Medium" ? [6, 8] : [9, 99];

    const byLength = pack.filter(w => {
      const L = len(w.word);
      return L >= min && L <= max;
    });

    return byLength.length ? byLength : pack;
  }, [pack, difficulty]);


  // NEW: random order without repeats - @mslyflorial
  const [order, setOrder] = useState<number[]>([]);

  // Reset game when the filtered list changes
  useEffect(() => {
  if (!filtered.length) return;
  const idxs = Array.from({ length: filtered.length }, (_, i) => i);
  setOrder(shuffle(idxs));
  setIndex(0);
  setGuesses(new Set());
  setMisses(0);
}, [filtered]);


  // NEW
  const current = filtered[order[index] ?? 0];
  const target = current?.word?.toUpperCase() || "";


  const lettersInWord = useMemo(
    () => new Set(target.replace(/[^A-Z]/g, "").split("")),
    [target]
  );

  const wrongLetters = useMemo(
    () => [...guesses].filter((g) => !lettersInWord.has(g)).sort(),
    [guesses, lettersInWord]
  );

  const won = target && [...lettersInWord].every((l) => guesses.has(l));
  const lost = misses >= maxMisses;
  const showResult = won || lost;
  const stage = lost ? 7 : Math.min(misses, maxMisses); // face only on loss



  // how many letters still unknown
  const remainingLetters = useMemo(
    () => [...lettersInWord].filter((l) => !guesses.has(l)).length,
    [lettersInWord, guesses]
  );

  // show hint after 4 misses and still lots to guess
  const showHint = misses >= 4 && remainingLetters > 3;

  //random order without repeats
  const shuffle = <T,>(arr: T[]) => arr.map(v => [Math.random(), v] as const).sort((a,b)=>a[0]-b[0]).map(([,v])=>v);
  
  

  // build a hint: prefer definition; else a simple starts/ends fallback
  const rawWord = current?.word || "";

  const cleaned = rawWord.toUpperCase().replace(/[^A-Z]/g, "");

  const hintText =
        current?.hintText ??
        current?.definition ??
        (cleaned ? `Starts with “${cleaned[0]}” and ends with “${cleaned.slice(-1)}”.` : "");


      


  // Close keyboard + lock background scroll when modal is open
  useEffect(() => {
    if (showResult) inputRef.current?.blur();
    document.body.style.overflow = showResult ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showResult]);


  function guessLetter(raw: string) {
    if (!raw || !target || won || lost) return;
    const up = raw.slice(-1).toUpperCase().replace(/[^A-Z]/g, "");
    if (!up || guesses.has(up)) return;
    const next = new Set(guesses).add(up);
    setGuesses(next);
    if (!lettersInWord.has(up)) setMisses((m) => m + 1);
  }

      function nextWord() {
      setGuesses(new Set());
      setMisses(0);
      setIndex(i => {
        if (i + 1 >= order.length) {
          // all used → reshuffle a fresh order
          const idxs = Array.from({ length: filtered.length }, (_, k) => k);
          setOrder(shuffle(idxs));
          return 0;
        }
        return i + 1;
      });
      setTimeout(() => inputRef.current?.focus(), 0);
    }


  useEffect(() => {
    inputRef.current?.focus();
  }, [target]);

    function fireConfetti() {
    // 3 quick bursts (center, left, right)
    const common = { particleCount: 90, spread: 70, startVelocity: 45, ticks: 200, zIndex: 9999 };
    confetti({ ...common, origin: { x: 0.5, y: 0.6 } });
    setTimeout(() => confetti({ ...common, particleCount: 70, origin: { x: 0.15, y: 0.6 } }), 120);
    setTimeout(() => confetti({ ...common, particleCount: 70, origin: { x: 0.85, y: 0.6 } }), 240);
  }

      useEffect(() => {
      if (!won) return;
      fireConfetti();
      // play sound (may fail on very strict iOS until first user gesture — here it follows a keypress)
      try {
        if (winSfxRef.current) {
          winSfxRef.current.currentTime = 0;
          void winSfxRef.current.play();
        }
      } catch {}
    }, [won]);

          useEffect(() => {
        if (!lost) return;
        try {
          if (loseSfxRef.current) {
            loseSfxRef.current.currentTime = 0;
            void loseSfxRef.current.play();
          }
        } catch {}
        // optional haptic
        if ("vibrate" in navigator) navigator.vibrate?.(200);
      }, [lost]);


  const dashed = target ? dashedMask(target, guesses) : "loading…";

  return (
    <div className="min-h-[100dvh] p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      {/* Top content (centered horizontally, stays at top) */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between">
          <button onClick={onExit} className="text-sm opacity-80">← back</button>
          <div className="text-sm opacity-80">Lives: {Math.max(0, maxMisses - misses)}</div>
        </div>

        {/* Input first */}
        <div className="w-full flex justify-center mt-6 sm:mt-14">
          <input
              ref={inputRef}
              type="text"
              inputMode="text"
              pattern="[A-Za-z]"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              maxLength={1}
              placeholder="Type a letter"
              onFocus={(e) => {
                // keep the field visible when the keyboard opens
                setTimeout(() => {
                  e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" });
                }, 0);
              }}
              onChange={(e) => {
                const v = e.currentTarget.value;
                if (v) guessLetter(v);
                e.currentTarget.value = "";
              }}
              className="w-64 text-center text-lg rounded-2xl border-2 shadow"
              style={{
                padding: "4px 15px",
                borderColor: "#03A696",
                background: "rgba(121, 112, 112, 0.92)",
                color: "#111",
              }}
          />
        </div>

        {/* Auto hint (appears after 4 misses & >3 letters left) */}
        {showHint && hintText && (
          <div className="w-full flex justify-center mt-3">
            <div className="inline-block px-3 py-1 rounded-full text-sm bg-white/90 text-neutral-900 shadow">
              <span className="font-semibold">Hint:</span> {hintText}
            </div>
          </div>
        )}


        {/* Dashes/letters row */}
        <div className="w-full flex justify-center">
          <div className="font-mono text-3xl tracking-widest select-none">
            {dashed}
          </div>
        </div>

        {/* Wrong words — reserve space even when empty */}
          <div className={`w-full text-center ${keyboardOpen ? "min-h-[28px]" : "min-h-[40px]"}`}>
                <div className={`transition-opacity duration-150 ${wrongLetters.length ? "opacity-100" : "opacity-0"}`} aria-hidden={wrongLetters.length === 0}>
                  <div className="text-lg font-semibold mb-1">Wrong words :</div>
                  <div className="font-semibold tracking-wide" style={{ color: "#ef4444" }}>
                    {wrongLetters.join("  •  ")}
                  </div>
                </div>
              </div>


        {/* Hangman below */}
        <div className={keyboardOpen ? "w-40" : "w-56 sm:w-64"}>
          <HangmanCanvas stage={stage} className="w-full h-auto" />
        </div>
      </div>


          {/* Result modal */}
          {showResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* backdrop */}
              <div className="absolute inset-0 bg-black/50" />
              {/* dialog */}
              <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl
                              border border-neutral-200/60 dark:border-neutral-800/60 p-5 text-center">
                <div className="text-lg font-semibold">
                  {won ? "Great job!" : "Out of lives"}
                </div>
                <div className="mt-1 text-sm">
                  The word was <span className="font-bold "style={{ color: "#14d9e0ff" }}>{target}</span>
                </div>
                <div className="flex gap-3 justify-center mt-4">
                  <button
                    onClick={nextWord}
                    className="px-4 py-2 rounded-xl bg-[#03A696] text-white font-medium"
                  >
                    Next word
                  </button>
                  <button
                    onClick={onExit}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-white font-medium"
                  >
                    Change difficulty
                  </button>
                </div>
              </div>
            </div>
          )}
    
    </div>
  );
}
