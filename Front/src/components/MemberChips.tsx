interface MemberChipsProps {
  members: string[];
  /** Currently selected members (single or multi). */
  selected: Set<string> | string | null;
  onToggle: (member: string) => void;
  /** Optional quick-add chip handler (Donate tab). */
  onAdd?: () => void;
}

export function MemberChips({ members, selected, onToggle, onAdd }: MemberChipsProps) {
  const isSel = (m: string) =>
    selected instanceof Set ? selected.has(m) : selected === m;

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <button
          key={m}
          onClick={() => onToggle(m)}
          className={
            "px-3.5 py-2 rounded-[20px] text-[13px] cursor-pointer transition-all active:scale-95 border " +
            (isSel(m)
              ? "bg-gold text-black border-gold font-semibold"
              : "bg-panel2 text-text border-border")
          }
        >
          {m}
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
