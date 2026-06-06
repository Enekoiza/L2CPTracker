import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { useToast } from "../../components/Toast";
import { EVENTS } from "../../data/events";
import { Card, Label, Button, Empty } from "../../components/ui";
import { fmt } from "../../lib/search";

const EXAMPLES: [string, number][] = [
  ["2000 Animal Bone", 60 * 2000],
  ["1 Stone of Purity", 5000],
  ["100 Enria", 30000 * 100],
];

export function SetupTab() {
  const members = useStore((s) => s.members);
  const divisor = useStore((s) => s.divisor);
  const addMember = useStore((s) => s.addMember);
  const removeMember = useStore((s) => s.removeMember);
  const setDivisor = useStore((s) => s.setDivisor);
  const reset = useStore((s) => s.reset);
  const toast = useToast();

  const [name, setName] = useState("");

  const add = () => {
    if (addMember(name)) setName("");
    else setName("");
  };

  const remove = (m: string) => {
    if (confirm(`Remove ${m}? Their log entries remain.`)) removeMember(m);
  };

  const doReset = () => {
    if (
      confirm(
        "Reset ALL data? Members, points, and log will be erased. This cannot be undone."
      )
    ) {
      reset();
      toast("All data reset");
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
            className="bg-gold text-black border-none rounded-[10px] px-[18px] font-bold cursor-pointer"
          >
            Add
          </button>
        </div>
        {members.length === 0 ? (
          <Empty>No members yet.</Empty>
        ) : (
          members.map((m) => (
            <div
              key={m}
              className="flex justify-between items-center bg-panel2 border border-border rounded-[10px] px-3 py-2.5 mb-2"
            >
              <span>{m}</span>
              <button
                onClick={() => remove(m)}
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
          onChange={(e) => setDivisor(parseInt(e.target.value))}
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

      <Card>
        <Label>Danger Zone</Label>
        <Button variant="danger" small onClick={doReset}>
          Reset All Data
        </Button>
      </Card>
    </div>
  );
}
