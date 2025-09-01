import React, { createContext, useContext, useEffect, useState } from "react";


export type Lang = "en" | "fr";
export type Settings = { lang: Lang; sound: boolean };

const KEY = "hanginlearn.settings.v1";

const Ctx = createContext<{
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}>({
  settings: { lang: "en", sound: true },
  setSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "") as Settings;
    } catch {
      return { lang: "en", sound: true };
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);
  return <Ctx.Provider value={{ settings, setSettings }}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);