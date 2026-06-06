import type { Member } from "../types";

interface MemberChipsProps {
  members: Member[];
  /** Selected member ids (single via one-element set, or multi). */
  selected: Set<string>;
  onToggle: (id: string) => void;
  /** Optional quick-add chip handler (Donate tab). */
  onAdd?: () => void;
}

export function MemberChips({ members, selected, onToggle, onAdd }: MemberChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => onToggle(m.id)}
          className={
            "px-3.5 py-2 rounded-[20px] text-[13px] cursor-pointer transition-all active:scale-95 border " +
            (selected.has(m.id)
              ? "bg-gold text-black border-gold font-semibold"
              : "bg-panel2 text-text border-border")
          }
        >
          {m.name}
        </button>
      ))}
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-3.5 py-2 rounded-[20px] text-[13px] cursor-pointer border border-dashed border-border text-gold active:scale-95"
        >
          + New Member
        </button>
      )}
    </div>
  );
}
