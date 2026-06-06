import { useMemo, useState } from "react";
import { useStore, memberStats } from "../../hooks/useStore";
import { Empty } from "../../components/ui";
import { fmt, fmtDate } from "../../lib/search";

function badgeClass(badge: string): string {
  if (badge.startsWith("PARTY")) return "bg-[#1a2230] text-d";
  if (badge === "EVENT") return "bg-[#2a1f0e] text-gold";
  return "bg-[#1a2a20] text-green";
}

export function LogTab() {
  const members = useStore((s) => s.members);
  const log = useStore((s) => s.log);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const r = members
      .map((m) => ({ m, ...memberStats(log, m) }))
      .sort((a, b) => b.total - a.total);
    const grand = r.reduce((s, x) => s + x.total, 0);
    const max = Math.max(...r.map((x) => x.total), 1);
    return { r, grand, max };
  }, [members, log]);

  const toggle = (m: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });

  if (rows.r.length === 0 || rows.grand === 0) {
    return (
      <div className="fade">
        <Empty>
          No contributions logged yet.
          <br />
          Start donating to build the leaderboard.
        </Empty>
      </div>
    );
  }

  return (
    <div className="fade">
      {rows.r.map((row, i) => {
        const share = rows.grand > 0 ? (row.total / rows.grand) * 100 : 0;
        const open = expanded.has(row.m);
        const entries = open
          ? log.filter((e) => e.member === row.m).sort((a, b) => b.ts - a.ts)
          : [];

        return (
          <div
            key={row.m}
            onClick={() => toggle(row.m)}
            className="bg-panel border border-border rounded-xl p-3 mb-2.5 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] text-muted w-5 font-bold">{i + 1}</span>
                <span className="text-[15px] font-semibold">{row.m}</span>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-green">{row.total}</div>
                <div className="text-[11px] text-muted">{fmt(share)}% share</div>
              </div>
            </div>

            <div className="h-[7px] bg-[#0d0d0d] rounded-md overflow-hidden">
              <div
                className="h-full rounded-md bg-gradient-to-r from-gold to-green"
                style={{ width: `${(row.total / rows.max) * 100}%` }}
              />
            </div>

            {open && (
              <div className="mt-2.5 pt-2.5 border-t border-border">
                <div className="flex gap-2 mb-2.5">
                  <Stat value={row.total} label="Total" color="text-green" />
                  <Stat value={row.mat} label="Materials" color="text-gold" />
                  <Stat value={row.event} label="Events" color="text-d" />
                </div>

                {entries.length === 0 ? (
                  <Empty>No entries.</Empty>
                ) : (
                  entries.map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between items-start py-2 border-b border-[#1c1c1c] last:border-none text-xs gap-2"
                    >
                      <div>
                        <div className="text-text">{e.desc}</div>
                        <div className="text-[#666] text-[10px] mt-0.5">
                          {fmtDate(e.ts)}
                        </div>
                        <span
                          className={
                            "inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 font-semibold tracking-wide " +
                            badgeClass(e.badge)
                          }
                        >
                          {e.badge}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-green font-bold">+{e.pts}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex-1 bg-[#0d0d0d] rounded-lg py-2 text-center">
      <div className={"text-base font-bold " + color}>{value}</div>
      <div className="text-[9px] text-muted uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}
