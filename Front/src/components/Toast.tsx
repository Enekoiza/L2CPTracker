import { createContext, use, useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

const ToastContext = createContext<(msg: string) => void>(() => {});

export function useToast() {
  return use(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <ToastContext value={toast}>
      {children}
      <div
        className={
          "fixed left-1/2 -translate-x-1/2 bg-gold text-black px-5 py-2.5 rounded-[20px] text-[13px] font-semibold z-[200] pointer-events-none transition-all " +
          (show ? "opacity-100 bottom-[86px]" : "opacity-0 bottom-20")
        }
      >
        {msg}
      </div>
    </ToastContext>
  );
}
