import { useState } from "react";
import type { TabKey } from "./types";
import { ToastProvider } from "./components/Toast";
import { BottomNav } from "./components/BottomNav";
import { DonateTab } from "./features/donate/DonateTab";
import { PartyTab } from "./features/party/PartyTab";
import { EventsTab } from "./features/events/EventsTab";
import { LogTab } from "./features/log/LogTab";
import { SetupTab } from "./features/setup/SetupTab";

export function App() {
  const [tab, setTab] = useState<TabKey>("donate");

  return (
    <ToastProvider>
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#111] to-bg px-4 pt-3.5 pb-2.5 border-b border-border">
        <h1 className="text-lg text-gold tracking-[0.5px] font-semibold m-0">
          ⚔ L2 CP TRACKER
        </h1>
        <div className="text-[11px] text-muted mt-0.5">
          Contribution points for the party
        </div>
      </header>

      <main className="p-4">
        {tab === "donate" && <DonateTab goTo={setTab} />}
        {tab === "party" && <PartyTab goTo={setTab} />}
        {tab === "events" && <EventsTab goTo={setTab} />}
        {tab === "log" && <LogTab />}
        {tab === "setup" && <SetupTab />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </ToastProvider>
  );
}
