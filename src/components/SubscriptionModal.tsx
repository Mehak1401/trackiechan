import { useState } from "react";
import { Subscription } from "@/lib/mockData";
import { isCanceled } from "@/lib/subscriptionUtils";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionModalProps {
  day: number;
  subscriptions: Subscription[];
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function SubscriptionModal({ day, subscriptions, onClose, onDelete }: SubscriptionModalProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await onDelete(confirmId);
      setConfirmId(null);
      if (subscriptions.length <= 1) onClose();
    } finally {
      setDeleting(false);
    }
  };

  const confirmSub = subscriptions.find((s) => s.id === confirmId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-sm bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">
              Due on {day}<sup>{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}</sup>
            </h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="divide-y divide-border">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 px-4 py-3 group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: sub.color + "18", color: sub.color }}
                >
                  {sub.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground">{sub.name}</p>
                    {isCanceled(sub) && (
                      <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {sub.autopay ? "Canceled" : "Autopay Stopped"}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {sub.cycle} · {sub.paymentSource}
                  </p>
                </div>
                <span className="text-sm font-mono font-medium text-foreground">
                  ₹{sub.amount.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => setConfirmId(sub.id)}
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                  title="End subscription"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-accent/30">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-mono font-semibold text-foreground">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end <span className="font-semibold text-foreground">{confirmSub?.name}</span>? This will permanently remove it from your tracker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Ending…" : "End Subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
}
