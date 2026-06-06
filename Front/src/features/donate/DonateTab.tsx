import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { useItemRows } from "../../hooks/useItemRows";
import { useToast } from "../../components/Toast";
import { Card, Label, Button, Preview } from "../../components/ui";
import { MemberChips } from "../../components/MemberChips";
import { ItemRowEditor } from "../../components/ItemRowEditor";
import { fmt } from "../../lib/search";
import type { TabKey } from "../../types";

export function DonateTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const members = useStore((s) => s.members);
  const divisor = useStore((s) => s.divisor);
  const addMember = useStore((s) => s.addMember);
  const addEntries = useStore((s) => s.addEntries);
  const toast = useToast();

  const [member, setMember] = useState<string | null>(null);
  const rowsApi = useItemRows(divisor);

  const canLog = !!member && rowsApi.total > 0;

  const quickAdd = () => {
    const name = prompt("New member name:");
    if (name && name.trim()) {
      addMember(name);
      setMember(name.trim());
    }
  };

  const log = () => {
    if (!canLog) return;
    addEntries([
      {
        type: "mat",
        member: member!,
        pts: fmt(rowsApi.total),
        desc: rowsApi.summary,
        badge: "SOLO",
      },
    ]);
    rowsApi.reset();
    setMember(null);
    toast("Donation logged!");
    goTo("log");
  };

  return (
    <div className="fade">
      <Card>
        <Label>Donating Member</Label>
        <MemberChips
          members={members}
          selected={member}
          onToggle={(m) => setMember(m)}
          onAdd={quickAdd}
        />
      </Card>

      <ItemRowEditor api={rowsApi} divisor={divisor} />

      <Preview title="Total Points">{fmt(rowsApi.total)}</Preview>

      <Button onClick={log} disabled={!canLog}>
        Log Donation
      </Button>
    </div>
  );
}
