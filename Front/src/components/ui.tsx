import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-panel border border-border rounded-2xl p-3.5 mb-3.5">
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[1px] text-muted mb-2 font-semibold">
      {children}
    </div>
  );
}

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  small?: boolean;
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  small,
}: BtnProps) {
  const base =
    "w-full rounded-xl font-bold tracking-wide transition-opacity active:opacity-80 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer";
  const pad = small ? "py-2.5 text-[13px]" : "py-3.5 text-[15px]";
  const styles =
    variant === "primary"
      ? "bg-gold text-black border-none"
      : variant === "danger"
        ? "bg-transparent border border-[color:var(--color-b)] text-[color:var(--color-b)]"
        : "bg-transparent border border-border text-text";
  return (
    <button
      className={`${base} ${pad} ${styles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface PreviewProps {
  title: ReactNode;
  children: ReactNode;
}

export function Preview({ title, children }: PreviewProps) {
  return (
    <div className="bg-gradient-to-br from-[#15201a] to-[#101810] border border-[#234] rounded-xl px-3.5 py-3 mb-3.5 flex justify-between items-center">
      <div className="text-[11px] text-muted uppercase tracking-[1px]">{title}</div>
      <div className="text-[26px] font-bold text-green">{children}</div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="text-center text-[#555] py-8 px-2.5 text-[13px]">{children}</div>;
}
