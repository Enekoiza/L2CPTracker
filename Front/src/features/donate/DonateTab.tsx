import { useState } from "react";
import { useItemRows } from "../../hooks/useItemRows";
import {
  useCreateContributions,
  useCreateMember,
  useMembers,
  useSettings,
} from "../../hooks/queries";
import { useToast } from "../../components/Toast";
import { Card, Label, Button, Preview, Empty } from "../../components/ui";
import { MemberChips } from "../../components/MemberChips";
import { ItemRowEditor } from "../../components/ItemRowEditor";
import { fmt } from "../../lib/search";
import type { TabKey } from "../../types";

export function DonateTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const { data: members = [] } = useMembers();
  const { data: settings } = useSettings();
  const divisor = settings?.divisor ?? 1000;

  const createMember = useCreateMember();
  const createContributions = useCreateContributions();
  const toast = useToast();

  const [memberId, setMemberId] = useState<string | null>(null);
  const rowsApi = useItemRows(divisor);

  const canLog = !!memberId && rowsApi.total > 0 && !createContributions.isPending;

  const quickAdd = async () => {
    const name = prompt("New member name:");
    if (!name || !name.trim()) return;
    try {
      const created = await createMember.mutateAsync(name.trim());
      setMemberId(created.id);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not create member");
    }
  };

  const log = async () => {
    if (!memberId || rowsApi.total <= 0) return;
    try {
      await createContributions.mutateAsync([
        {
          memberId,
          type: "Material",
          points: fmt(rowsApi.total),
          description: rowsApi.summary,
          badge: "SOLO",
        },
      ]);
      rowsApi.reset();
      setMemberId(null);
      toast("Donation logged!");
      goTo("log");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to log donation");
    }
  };

  return (
    <div className="fade">
      <Card>
        <Label>Donating Member</Label>
        {members.length === 0 ? (
          <Empty>No members yet — add one with the chip below or in Setup.</Empty>
        ) : null}
        <MemberChips
          members={members}
          selected={new Set(memberId ? [memberId] : [])}
          onToggle={(id) => setMemberId(id)}
          onAdd={quickAdd}
        />
      </Card>

      <ItemRowEditor api={rowsApi} divisor={divisor} />

      <Preview title="Total Points">{fmt(rowsApi.total)}</Preview>

      <Button onClick={log} disabled={!canLog}>
        {createContributions.isPending ? "Logging…" : "Log Donation"}
      </Button>
    </div>
  );
}
