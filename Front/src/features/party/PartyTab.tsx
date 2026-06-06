import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { useItemRows } from "../../hooks/useItemRows";
import { useToast } from "../../components/Toast";
import { Card, Label, Button } from "../../components/ui";
import { MemberChips } from "../../components/MemberChips";
import { ItemRowEditor } from "../../components/ItemRowEditor";
import { fmt } from "../../lib/search";
import type { TabKey } from "../../types";

export function PartyTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const members = useStore((s) => s.members);
  const divisor = useStore((s) => s.divisor);
  const addEntries = useStore((s) => s.addEntries);
  const toast = useToast();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rowsApi = useItemRows(divisor);

  const count = selected.size;
  const each = count > 0 ? rowsApi.total / count : 0;
  const canLog = count > 0 && rowsApi.total > 0;

  const toggle = (m: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });

  const log = () => {
    if (!canLog) return;
    const eachPts = fmt(rowsApi.total / count);
    addEntries(
      [...selected].map((m) => ({
        type: "mat" as const,
        member: m,
        pts: eachPts,
        desc: `Party loot: ${rowsApi.summary}`,
        badge: `PARTY ÷${count}`,
      }))
    );
    rowsApi.reset();
    setSelected(new Set());
    toast("Party split logged!");
    goTo("log");
  };

  return (
    <div className="fade">
      <Card>
        <Label>Split Among (tap multiple)</Label>
        <MemberChips members={members} selected={selected} onToggle={toggle} />
      </Card>

      <ItemRowEditor api={rowsApi} divisor={divisor} />

      <div className="bg-gradient-to-br from-[#15201a] to-[#101810] border border-[#234] rounded-xl px-3.5 py-3 mb-3.5 flex justify-between items-center">
        <div className="text-[11px] text-muted uppercase tracking-[1px]">
          Total / {count} = Each
        </div>
        <div className="text-[26px] font-bold text-green">
          {fmt(rowsApi.total)} → <span className="text-gold">{fmt(each)}</span>
        </div>
      </div>

      <Button onClick={log} disabled={!canLog}>
        Log Party Split
      </Button>
    </div>
  );
}
