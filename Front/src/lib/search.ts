import { MATERIALS } from "../data/materials";
import type { Material } from "../types";

/** Inline material search ranked by match quality (exact > prefix > alias > substring). */
export function searchMaterials(query: string, limit = 6): Material[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const res: { m: Material; score: number }[] = [];
  for (const m of MATERIALS) {
    const name = m.n.toLowerCase();
    let score = -1;
    if (name === q) score = 0;
    else if (name.startsWith(q)) score = 1;
    else if (m.a.some((al) => al === q)) score = 1;
    else if (m.a.some((al) => al.startsWith(q))) score = 2;
    else if (name.includes(q)) score = 3;
    else if (m.a.some((al) => al.includes(q))) score = 4;
    if (score >= 0) res.push({ m, score });
  }
  res.sort((x, y) => x.score - y.score);
  return res.slice(0, limit).map((r) => r.m);
}

/** Round to at most 2 decimals. */
export function fmt(n: number): number {
  return Math.round(n * 100) / 100;
}

export function fmtDate(ts: number): string {
  const d = new Date(ts);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}
