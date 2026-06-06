import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LogEntry, MemberStats } from "../types";
import { fmt } from "../lib/search";

interface StoreState {
  members: string[];
  divisor: number;
  log: LogEntry[];

  addMember: (name: string) => boolean;
  removeMember: (name: string) => void;
  setDivisor: (d: number) => void;
  addEntries: (entries: Omit<LogEntry, "id" | "ts">[]) => void;
  reset: () => void;
}

const DEFAULT_MEMBERS = ["Tank", "Healer", "Mage", "DD"];

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      members: DEFAULT_MEMBERS,
      divisor: 1000,
      log: [],

      addMember: (name) => {
        const n = name.trim();
        if (!n || get().members.includes(n)) return false;
        set((s) => ({ members: [...s.members, n] }));
        return true;
      },

      removeMember: (name) =>
        set((s) => ({ members: s.members.filter((m) => m !== name) })),

      setDivisor: (d) => set({ divisor: d }),

      addEntries: (entries) => {
        const ts = Date.now();
        const built: LogEntry[] = entries.map((e) => ({ ...e, id: newId(), ts }));
        set((s) => ({ log: [...s.log, ...built] }));
      },

      reset: () =>
        set({ members: DEFAULT_MEMBERS, divisor: 1000, log: [] }),
    }),
    { name: "l2cp_v1" }
  )
);

/** Aggregate a member's points split between materials and events. */
export function memberStats(log: LogEntry[], member: string): MemberStats {
  let mat = 0;
  let event = 0;
  for (const e of log) {
    if (e.member !== member) continue;
    if (e.type === "event") event += e.pts;
    else mat += e.pts;
  }
  return { mat: fmt(mat), event: fmt(event), total: fmt(mat + event) };
}
