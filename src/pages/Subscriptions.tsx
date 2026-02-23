import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { isCanceled, isCurrentlyActive } from "@/lib/subscriptionUtils";
import { ArrowLeft, Trash2, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

function durationSince(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

export default function Subscriptions() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { subscriptions, subscriptionsWithDates, isLoading, deleteSubscription } = useSubscriptions();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteSubscription(confirmId);
      setConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  const confirmSub = subscriptions.find((s) => s.id === confirmId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
          <Link to="/" className="p-1.5 rounded-md hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <h1 className="text-sm font-semibold text-foreground">My Subscriptions</h1>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-px bg-border mx-4 sm:mx-6 my-4 rounded-lg overflow-hidden border border-border">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card p-4 sm:p-5 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  Active
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-semibold text-foreground font-mono">
                {subscriptions.filter(isCurrentlyActive).length}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="bg-card p-4 sm:p-5 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  Monthly Cost
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-semibold text-foreground font-mono">
                ₹{subscriptions
                  .filter((s) => s.cycle === "monthly")
                  .reduce((sum, s) => sum + s.amount, 0)
                  .toLocaleString("en-IN")}
              </span>
            </motion.div>
          </div>

          {/* Subscription list */}
          <div className="mx-4 sm:mx-6 mb-6 border border-border rounded-lg overflow-hidden divide-y divide-border">
            {subscriptionsWithDates.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No active subscriptions yet.
              </div>
            )}
            {subscriptionsWithDates.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/30 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: sub.color + "18", color: sub.color }}
                >
                  {sub.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground">{sub.name}</p>
                    {isCanceled(sub) && (
                      <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Canceled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {sub.cycle} · Due {sub.dueDay}<sup>{sub.dueDay === 1 ? "st" : sub.dueDay === 2 ? "nd" : sub.dueDay === 3 ? "rd" : "th"}</sup> · {sub.paymentSource}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-medium text-foreground">
                    ₹{sub.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {durationSince(sub.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmId(sub.id)}
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 sm:opacity-100 hover:bg-destructive/10 transition-all"
                  title="End subscription"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end <span className="font-semibold text-foreground">{confirmSub?.name}</span>? This will permanently remove it.
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
    </div>
  );
}
