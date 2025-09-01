import React, { useState } from "react";
import Start from "./pages/start";
import Play from "./pages/Play";

export default function App() {
  const [difficulty, setDifficulty] = useState<"Easy"|"Medium"|"Hard"|null>(null);

  if (!difficulty) return <Start onStart={setDifficulty} />;

  return <Play difficulty={difficulty} onExit={() => setDifficulty(null)} />;
}
