import { useState } from "react";
import { useItemRows } from "../../hooks/useItemRows";
import {
  useCreateContributions,
  useMembers,
  useSettings,
} from "../../hooks/queries";
import { useToast } from "../../components/Toast";
import { Card, Label, Button } from "../../components/ui";
import { MemberChips } from "../../components/MemberChips";
import { ItemRowEditor } from "../../components/ItemRowEditor";
import { fmt } from "../../lib/search";
import type { TabKey } from "../../types";

export function PartyTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const { data: members = [] } = useMembers();
  const { data: settings } = useSettings();
  const divisor = settings?.divisor ?? 1000;

  const createContributions = useCreateContributions();
  const toast = useToast();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rowsApi = useItemRows(divisor);

  const count = selected.size;
  const each = count > 0 ? rowsApi.total / count : 0;
  const canLog = count > 0 && rowsApi.total > 0 && !createContributions.isPending;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const log = async () => {
    if (count === 0 || rowsApi.total <= 0) return;
    const eachPts = fmt(rowsApi.total / count);
    try {
      await createContributions.mutateAsync(
        [...selected].map((memberId) => ({
          memberId,
          type: "Material" as const,
          points: eachPts,
          description: `Party loot: ${rowsApi.summary}`,
          badge: `PARTY ÷${count}`,
        }))
      );
      rowsApi.reset();
      setSelected(new Set());
      toast("Party split logged!");
      goTo("log");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to log party split");
    }
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
        {createContributions.isPending ? "Logging…" : "Log Party Split"}
      </Button>
    </div>
  );
}
