import { useState } from "react";
import { SettingsProvider } from "./state/settings";
import Start from "./pages/start";
import Play from "./pages/play";
import { useEffect } from "react"
import { ensureNotifChannel } from "./utils/notify";

export default function App() {
  useEffect(() => { ensureNotifChannel(); }, []);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | null>(null);

  return (
    <SettingsProvider>
      {!difficulty
        ? <Start onStart={setDifficulty} />
        : <Play difficulty={difficulty} onExit={() => setDifficulty(null)} />}
    </SettingsProvider>
  );
}
