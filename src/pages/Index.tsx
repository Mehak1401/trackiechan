import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StatsOverview } from "@/components/StatsOverview";
import { CalendarGrid } from "@/components/CalendarGrid";
import { YearlyOverview } from "@/components/YearlyOverview";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { AddSubscriptionPanel } from "@/components/AddSubscriptionPanel";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useNotificationReminders } from "@/hooks/useNotificationReminders";
import { Subscription } from "@/lib/mockData";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { subscriptions, isLoading, addSubscription, deleteSubscription } = useSubscriptions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [selectedDay, setSelectedDay] = useState<{ day: number; subs: Subscription[] } | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  useNotificationReminders(subscriptions);


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

  const handlePrevMonth = () => {
    if (viewMode === "yearly") {
      setCurrentMonth((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    } else {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewMode === "yearly") {
      setCurrentMonth((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    } else {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleToggleView = () => setViewMode((v) => (v === "monthly" ? "yearly" : "monthly"));

  const handleMonthClick = (monthIdx: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIdx, 1));
    setViewMode("monthly");
  };

  const handleDayClick = (day: number, subs: Subscription[]) => setSelectedDay({ day, subs });

  const handleAddSubscription = async (sub: Subscription) => {
    await addSubscription(sub);
  };

  return (
    <div id="calendar-root" className="min-h-screen bg-background">
      <Header
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onAddClick={() => setShowAddPanel(true)}
        user={user}
        onSignOut={signOut}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <StatsOverview subscriptions={subscriptions} />
          {viewMode === "yearly" ? (
            <YearlyOverview
              year={currentMonth.getFullYear()}
              subscriptions={subscriptions}
              onMonthClick={handleMonthClick}
            />
          ) : (
            <CalendarGrid
              currentMonth={currentMonth}
              subscriptions={subscriptions}
              onDayClick={handleDayClick}
            />
          )}
        </>
      )}

      {selectedDay && (
        <SubscriptionModal
          day={selectedDay.day}
          subscriptions={selectedDay.subs}
          onClose={() => setSelectedDay(null)}
          onDelete={deleteSubscription}
        />
      )}

      {showAddPanel && (
        <AddSubscriptionPanel
          onClose={() => setShowAddPanel(false)}
          onAdd={handleAddSubscription}
        />
      )}
    </div>
  );
};

export default Index;
