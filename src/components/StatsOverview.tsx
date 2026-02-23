import { Subscription } from "@/lib/mockData";
import { isCurrentlyActive } from "@/lib/subscriptionUtils";
import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Activity } from "lucide-react";

interface StatsOverviewProps {
  subscriptions: Subscription[];
}

export function StatsOverview({ subscriptions }: StatsOverviewProps) {
  const activeSubs = subscriptions.filter(isCurrentlyActive);

  const monthlyTotal = activeSubs
    .filter((s) => s.cycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0);
  const yearlyFromMonthly = monthlyTotal * 12;
  const yearlyDirect = activeSubs
    .filter((s) => s.cycle === "yearly")
    .reduce((sum, s) => sum + s.amount, 0);
  const yearlyProjection = yearlyFromMonthly + yearlyDirect;

  const stats = [
    {
      label: "Monthly Spend",
      value: `₹${monthlyTotal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
      icon: IndianRupee,
    },
    {
      label: "Yearly Projection",
      value: `₹${yearlyProjection.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
      icon: TrendingUp,
    },
    {
      label: "Active",
      value: activeSubs.length.toString(),
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-px bg-border mx-4 sm:mx-6 my-4 rounded-lg overflow-hidden border border-border">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card p-3 sm:p-5 flex flex-col gap-1"
        >
          <div className="flex items-center gap-1.5">
            <stat.icon className="w-3 h-3 text-muted-foreground hidden sm:block" />
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <span className="text-lg sm:text-2xl font-semibold text-foreground tracking-tight font-mono">
            {stat.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
