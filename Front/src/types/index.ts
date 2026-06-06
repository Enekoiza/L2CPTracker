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

/** A CP member as returned by the backend. */
export interface Member {
  id: string;
  name: string;
}

/** A logged contribution as returned by the backend. */
export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  type: "Material" | "Event";
  points: number;
  description: string;
  badge: string; // SOLO | PARTY ÷N | EVENT
  ts: number; // unix epoch ms
}

/** One entry to send when logging contributions. */
export interface CreateContribution {
  memberId: string;
  type: "Material" | "Event";
  points: number;
  description: string;
  badge: string;
}

export interface Settings {
  divisor: number;
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
