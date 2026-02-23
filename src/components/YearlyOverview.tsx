import { Subscription } from "@/lib/mockData";
import { isVisibleOnDay, getActiveSubsForMonth } from "@/lib/subscriptionUtils";
import { motion } from "framer-motion";

interface YearlyOverviewProps {
  year: number;
  subscriptions: Subscription[];
  onMonthClick: (month: number) => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export function YearlyOverview({ year, subscriptions, onMonthClick }: YearlyOverviewProps) {
  const today = new Date();
  const isCurrentYear = today.getFullYear() === year;
  const currentMonth = today.getMonth();
  const todayDate = today.getDate();

  // Calculate totals from currently active subs only
  const activeSubs = subscriptions.filter((s) => !s.endDate || new Date(s.endDate) >= today);
  const totalMonthly = activeSubs
    .filter((s) => s.cycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0);
  const totalYearly = activeSubs
    .filter((s) => s.cycle === "yearly")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indicator-monthly" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Monthly</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indicator-yearly" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Yearly</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Est. annual{" "}
          <span className="text-foreground font-mono font-medium">
            ₹{(totalMonthly * 12 + totalYearly).toLocaleString("en-IN")}
          </span>
        </span>
      </div>

      {/* 12-month grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 12 }, (_, monthIdx) => {
          const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
          const firstDayOfWeek = (new Date(year, monthIdx, 1).getDay() + 6) % 7;
          const isThisMonth = isCurrentYear && monthIdx === currentMonth;

          const monthSubs = getActiveSubsForMonth(subscriptions, year, monthIdx);

          const cells: (number | null)[] = [];
          for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(d);
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <motion.div
              key={monthIdx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMonthClick(monthIdx)}
              className={`geist-card-hover p-3 cursor-pointer ${
                isThisMonth ? "border-foreground/30 bg-accent/50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isThisMonth ? "text-foreground" : "text-muted-foreground"}`}>
                  {MONTH_NAMES[monthIdx]}
                </span>
                {monthSubs.length > 0 && (
                  <span className="text-[9px] font-mono text-muted-foreground bg-secondary rounded px-1">
                    {monthSubs.length}
                  </span>
                )}
              </div>

              {/* Mini day headers */}
              <div className="grid grid-cols-7 gap-px mb-0.5">
                {DAYS_SHORT.map((d, i) => (
                  <div key={i} className="text-center text-[7px] text-muted-foreground/50 leading-tight">
                    {d}
                  </div>
                ))}
              </div>

              {/* Mini calendar cells */}
              <div className="grid grid-cols-7 gap-px">
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} className="aspect-square" />;
                  const daySubs = subscriptions.filter((s) => isVisibleOnDay(s, year, monthIdx, day));
                  const isTodayCell = isThisMonth && day === todayDate;

                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center relative rounded-[2px] ${
                        isTodayCell
                          ? "bg-foreground text-background"
                          : daySubs.length > 0
                          ? "bg-accent/80"
                          : ""
                      }`}
                    >
                      <span
                        className={`text-[6px] sm:text-[7px] leading-none ${
                          isTodayCell
                            ? "font-bold"
                            : daySubs.length > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {day}
                      </span>
                      {daySubs.length > 0 && !isTodayCell && (
                        <span
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full ${
                            daySubs.some((s) => s.cycle === "yearly")
                              ? "bg-indicator-yearly"
                              : "bg-indicator-monthly"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
