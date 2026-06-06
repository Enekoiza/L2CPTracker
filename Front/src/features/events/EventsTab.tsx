import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { useToast } from "../../components/Toast";
import { EVENTS } from "../../data/events";
import { Card, Label, Button, Preview } from "../../components/ui";
import { MemberChips } from "../../components/MemberChips";
import type { TabKey } from "../../types";

export function EventsTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const members = useStore((s) => s.members);
  const addEntries = useStore((s) => s.addEntries);
  const toast = useToast();

  const [event, setEvent] = useState<string | null>(null);
  const [attended, setAttended] = useState<Set<string>>(new Set());

  const selectedEvent = EVENTS.find((e) => e.n === event) ?? null;
  const pts = selectedEvent?.p ?? 0;
  const canLog = !!selectedEvent && attended.size > 0;

  const toggle = (m: string) =>
    setAttended((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });

  const log = () => {
    if (!canLog) return;
    addEntries(
      [...attended].map((m) => ({
        type: "event" as const,
        member: m,
        pts: selectedEvent!.p,
        desc: selectedEvent!.n,
        badge: "EVENT",
      }))
    );
    setEvent(null);
    setAttended(new Set());
    toast("Event logged!");
    goTo("log");
  };

  return (
    <div className="fade">
      <Card>
        <Label>Select Event</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {EVENTS.map((ev) => (
            <button
              key={ev.n}
              onClick={() => setEvent(ev.n)}
              className={
                "rounded-xl py-3.5 px-2.5 text-center cursor-pointer transition-all active:scale-95 border " +
                (event === ev.n
                  ? "border-gold bg-[#1f1a0e]"
                  : "border-border bg-panel2")
              }
            >
              <div className="text-[13px] font-semibold mb-1">{ev.n}</div>
              <div className="text-xs text-green font-bold">{ev.p} pts</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Attended (tap members)</Label>
        <MemberChips members={members} selected={attended} onToggle={toggle} />
      </Card>

      <Preview title="Each Member Gets">{pts}</Preview>

      <Button onClick={log} disabled={!canLog}>
        Log Event
      </Button>
    </div>
  );
}
