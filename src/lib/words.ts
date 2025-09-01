export type WordItem = {
  id: string; word: string;
  definition?: string; hintText?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
};
export type RemotePack = { version: number | string; lang: string; updatedAt: string; words: WordItem[] };

export async function loadWords(remoteUrl: string, fallbackUrl: string, cacheKey: string) {
  // 1) try remote (fresh)
  try {
    const r = await fetch(`${remoteUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = (await r.json()) as RemotePack;
    if (!Array.isArray(data.words)) throw new Error("bad schema");
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data.words;
  } catch {
    // 2) cached
    const cached = localStorage.getItem(cacheKey);
    if (cached) return (JSON.parse(cached) as RemotePack).words;
    // 3) bundled fallback
    const r = await fetch(fallbackUrl);
    const data = (await r.json()) as RemotePack;
    return data.words;
  }
}
