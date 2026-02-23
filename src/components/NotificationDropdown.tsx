import { useState } from "react";
import { motion } from "framer-motion";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { isCurrentlyActive } from "@/lib/subscriptionUtils";

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [tab, setTab] = useState<"upcoming" | "paid">("upcoming");
  const { subscriptions } = useSubscriptions();

  const today = new Date().getDate();

  // Only show notifications for active subscriptions
  const activeSubs = subscriptions.filter(isCurrentlyActive);

  const upcoming = activeSubs
    .filter((s) => s.dueDay > today)
    .map((s) => ({
      id: s.id,
      title: s.name,
      message: `Renews in ${s.dueDay - today} days`,
      time: `${s.dueDay - today}d`,
    }));

  const paid = activeSubs
    .filter((s) => s.dueDay <= today)
    .map((s) => ({
      id: s.id,
      title: s.name,
      message: `Paid on ${s.dueDay}th — ₹${s.amount.toLocaleString("en-IN")}`,
      time: s.dueDay === today ? "Today" : `${today - s.dueDay}d ago`,
    }));

  const filtered = tab === "upcoming" ? upcoming : paid;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.1 }}
        className="absolute right-0 top-10 z-50 w-72 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex border-b border-border">
          {(["upcoming", "paid"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                tab === t
                  ? "text-foreground border-b border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Nothing here</p>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-accent/40 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground">{n.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
