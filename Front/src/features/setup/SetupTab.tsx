import { useEffect, useState } from "react";
import {
  useCreateMember,
  useDeleteMember,
  useMembers,
  useSettings,
  useUpdateDivisor,
} from "../../hooks/queries";
import { useToast } from "../../components/Toast";
import { EVENTS } from "../../data/events";
import { Card, Label, Empty } from "../../components/ui";
import { fmt } from "../../lib/search";

const EXAMPLES: [string, number][] = [
  ["2000 Animal Bone", 60 * 2000],
  ["1 Stone of Purity", 5000],
  ["100 Enria", 30000 * 100],
];

export function SetupTab() {
  const { data: members = [] } = useMembers();
  const { data: settings } = useSettings();
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();
  const updateDivisor = useUpdateDivisor();
  const toast = useToast();

  const [name, setName] = useState("");
  const [divisor, setDivisorLocal] = useState(settings?.divisor ?? 1000);

  // keep the slider in sync once settings load / change elsewhere
  useEffect(() => {
    if (settings?.divisor) setDivisorLocal(settings.divisor);
  }, [settings?.divisor]);

  const add = async () => {
    const n = name.trim();
    if (!n) return;
    try {
      await createMember.mutateAsync(n);
      setName("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not add member");
      setName("");
    }
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Remove ${label}? Their contributions are removed too.`)) return;
    try {
      await deleteMember.mutateAsync(id);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not remove member");
    }
  };

  const commitDivisor = async (value: number) => {
    if (value === settings?.divisor) return;
    try {
      await updateDivisor.mutateAsync(value);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update divisor");
    }
  };

  return (
    <div className="fade">
      <Card>
        <Label>Members</Label>
        <div className="flex gap-2 mb-3.5">
          <input
            value={name}
            placeholder="New member name"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="flex-1 bg-[#0d0d0d] border border-border text-text rounded-[10px] p-2.5 text-sm"
          />
          <button
            onClick={add}
            disabled={createMember.isPending}
            className="bg-gold text-black border-none rounded-[10px] px-[18px] font-bold cursor-pointer disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {members.length === 0 ? (
          <Empty>No members yet.</Empty>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center bg-panel2 border border-border rounded-[10px] px-3 py-2.5 mb-2"
            >
              <span>{m.name}</span>
              <button
                onClick={() => remove(m.id, m.name)}
                className="bg-none border-none text-[color:var(--color-b)] text-lg cursor-pointer"
              >
                ×
              </button>
            </div>
          ))
        )}
      </Card>

      <Card>
        <Label>Points Divisor</Label>
        <div className="text-2xl font-bold text-gold text-center">{divisor}</div>
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={divisor}
          onChange={(e) => setDivisorLocal(parseInt(e.target.value))}
          onMouseUp={(e) => commitDivisor(parseInt((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitDivisor(parseInt((e.target as HTMLInputElement).value))}
          className="slider my-3.5"
        />
        <div className="flex flex-col gap-1.5 mt-2.5 text-xs text-muted">
          {EXAMPLES.map(([label, adena]) => (
            <span key={label}>
              {label} = <b className="text-green">{fmt(adena / divisor)} pts</b>
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Event Points Reference</Label>
        {EVENTS.map((ev) => (
          <div
            key={ev.n}
            className="flex justify-between py-1.5 border-b border-[#1c1c1c] last:border-none text-[13px]"
          >
            <span>{ev.n}</span>
            <span className="text-green font-semibold">{ev.p} pts</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
