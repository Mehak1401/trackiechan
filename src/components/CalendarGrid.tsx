import { Subscription } from "@/lib/mockData";
import { isVisibleOnDay, getActiveSubsForMonth } from "@/lib/subscriptionUtils";
import { motion } from "framer-motion";

interface CalendarGridProps {
  currentMonth: Date;
  subscriptions: Subscription[];
  onDayClick: (day: number, subs: Subscription[]) => void;
}

const DAYS_FULL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export function CalendarGrid({ currentMonth, subscriptions, onDayClick }: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  // Only count active subs for this month's total
  const activeSubs = getActiveSubsForMonth(subscriptions, year, month);
  const totalMonthly = activeSubs
    .filter((s) => s.cycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getSubsForDay = (day: number) =>
    subscriptions.filter((s) => isVisibleOnDay(s, year, month, day));

  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* Legend */}
      <div className="flex items-center justify-between mb-3">
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
          Total <span className="text-foreground font-mono font-medium">₹{totalMonthly.toLocaleString("en-IN")}</span>
        </span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_FULL.map((d, i) => (
          <div key={d + i} className="text-center text-[10px] sm:text-xs text-muted-foreground py-1.5 font-medium">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{DAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="aspect-square" />;
          const daySubs = getSubsForDay(day);
          const isToday = isCurrentMonth && day === todayDate;

          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.97 }}
              onClick={() => daySubs.length > 0 && onDayClick(day, daySubs)}
              className={`aspect-square p-1 sm:p-1.5 flex flex-col justify-between relative ${
                isToday ? "calendar-cell-today" : "calendar-cell"
              } ${daySubs.length > 0 ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`text-[10px] sm:text-xs font-medium ${isToday ? "text-foreground" : "text-muted-foreground"}`}>
                {day}
              </span>

              {daySubs.length > 0 && (
                <div className="flex items-center gap-px flex-wrap">
                  {daySubs.slice(0, 2).map((sub) => (
                    <div
                      key={sub.id}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[7px] sm:text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: sub.color + "20", color: sub.color }}
                      title={sub.name}
                    >
                      {sub.initial}
                    </div>
                  ))}
                  {daySubs.length > 2 && (
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium ml-0.5">
                      +{daySubs.length - 2}
                    </span>
                  )}
                  <span
                    className={`absolute top-1 right-1 w-1 h-1 rounded-full ${
                      daySubs.some((s) => s.cycle === "yearly") ? "bg-indicator-yearly" : "bg-indicator-monthly"
                    }`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
