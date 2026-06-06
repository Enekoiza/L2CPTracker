import type { TabKey } from "../types";

const TABS: { key: TabKey; ico: string; label: string }[] = [
  { key: "donate", ico: "💰", label: "Donate" },
  { key: "party", ico: "🛡", label: "Party" },
  { key: "events", ico: "⚔", label: "Events" },
  { key: "log", ico: "📊", label: "Log" },
  { key: "setup", ico: "⚙", label: "Setup" },
];

interface BottomNavProps {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] flex bg-[#111] border-t border-border z-[60]">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={
            "flex-1 bg-none border-none py-2.5 px-0.5 text-[10px] cursor-pointer flex flex-col items-center gap-[3px] transition-colors " +
            (active === t.key ? "text-gold" : "text-muted")
          }
        >
          <span className="text-lg leading-none">{t.ico}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
