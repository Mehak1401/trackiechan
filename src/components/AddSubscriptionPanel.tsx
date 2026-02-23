import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Subscription, KNOWN_BRANDS } from "@/lib/mockData";

interface AddSubscriptionPanelProps {
  onClose: () => void;
  onAdd: (sub: Subscription) => void;
}

const PAYMENT_OPTIONS = ["Credit Card", "UPI", "Net Banking", "PayPal", "Google Pay", "Apple Pay", "Custom"];

export function AddSubscriptionPanel({ onClose, onAdd }: AddSubscriptionPanelProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [dueDay, setDueDay] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [autopay, setAutopay] = useState(true);
  const [paymentSource, setPaymentSource] = useState("Credit Card");
  const [customPayment, setCustomPayment] = useState("");

  const brand = KNOWN_BRANDS[name.toLowerCase()];
  const previewColor = brand?.color || "#6B7280";
  const previewInitial = brand?.initial || (name ? name[0].toUpperCase() : "?");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDay) return;
    const finalPaymentSource = paymentSource === "Custom" ? customPayment : paymentSource;
    if (paymentSource === "Custom" && !customPayment.trim()) return;

    onAdd({
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      currency: "INR",
      cycle,
      dueDay: parseInt(dueDay),
      color: previewColor,
      initial: previewInitial,
      autopay,
      paymentSource: finalPaymentSource,
      startDate,
      endDate: endDate || null,
    });
    onClose();
  };

  const inputClass = "w-full h-9 px-3 rounded-md bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors";

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card border-l border-border overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 h-12 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Add Subscription</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name + Logo */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-5 transition-colors duration-150"
              style={{ backgroundColor: previewColor + "18", color: previewColor }}
            >
              {previewInitial}
            </div>
            <div className="flex-1">
              <label className="block text-[11px] text-muted-foreground mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, Spotify..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Billing Cycle</label>
            <div className="flex bg-background rounded-md p-0.5 border border-border">
              {(["monthly", "yearly"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={`flex-1 h-7 rounded text-xs font-medium capitalize transition-colors ${
                    cycle === c
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Due Day */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Due Day</label>
            <input
              type="number"
              min="1"
              max="31"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="1–31"
              className={inputClass}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">End Date / Stop Autopay</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Leave blank if ongoing.</p>
          </div>

          {/* Autopay */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Autopay</label>
            <button
              type="button"
              onClick={() => setAutopay(!autopay)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${
                autopay ? "bg-foreground" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-150 ${
                  autopay ? "translate-x-4 bg-background" : "translate-x-0 bg-muted-foreground"
                }`}
              />
            </button>
          </div>

          {/* Payment Source */}
          <div>
            <label className="block text-[11px] text-muted-foreground mb-1">Payment Source</label>
            <select
              value={paymentSource}
              onChange={(e) => setPaymentSource(e.target.value)}
              className={inputClass}
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Custom Payment */}
          {paymentSource === "Custom" && (
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Custom Source</label>
              <input
                type="text"
                value={customPayment}
                onChange={(e) => setCustomPayment(e.target.value)}
                placeholder="e.g. HDFC Debit, PhonePe..."
                className={inputClass}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full h-9 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Add Subscription
          </button>
        </form>
      </motion.div>
    </>
  );
}
