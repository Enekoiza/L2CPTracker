export type Grade = "NG" | "D" | "C" | "B";

export interface Material {
  n: string;
  p: number; // NPC adena price
  g: Grade;
  a: string[]; // search aliases
}

export interface GameEvent {
  n: string;
  p: number; // flat points
}

export type LogType = "mat" | "event";

export interface LogEntry {
  id: string;
  type: LogType;
  member: string;
  pts: number;
  desc: string;
  badge: string; // SOLO | PARTY ÷N | EVENT
  ts: number;
}

export interface MemberStats {
  mat: number;
  event: number;
  total: number;
}

export type TabKey = "donate" | "party" | "events" | "log" | "setup";

/** A row in the Donate / Party item editors. */
export interface ItemRow {
  id: number;
  qty: number;
  query: string;
  picked: Material | null;
}
