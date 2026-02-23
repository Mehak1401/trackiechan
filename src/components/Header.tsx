import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronLeft, ChevronRight, Plus, LogOut, Menu, X, List, CalendarDays, Grid3X3 } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddClick: () => void;
  user: User;
  onSignOut: () => void;
  viewMode: "monthly" | "yearly";
  onToggleView: () => void;
}

export function Header({ currentMonth, onPrevMonth, onNextMonth, onAddClick, user, onSignOut, viewMode, onToggleView }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = (user.user_metadata?.full_name || user.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="border-b border-border">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            trackie<span className="text-muted-foreground font-normal">chan</span>
          </h1>
          <div className="h-4 w-px bg-border" />
          {viewMode === "monthly" ? (
            <div className="flex items-center gap-1">
              <button onClick={onPrevMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm text-foreground min-w-[130px] text-center font-medium tabular-nums">
                {monthYear}
              </span>
              <button onClick={onNextMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={onPrevMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm text-foreground min-w-[60px] text-center font-medium tabular-nums">
                {currentMonth.getFullYear()}
              </span>
              <button onClick={onNextMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
          <button
            onClick={onToggleView}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            title={viewMode === "monthly" ? "Yearly overview" : "Monthly view"}
          >
            {viewMode === "monthly" ? (
              <Grid3X3 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/subscriptions"
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
            title="My Subscriptions"
          >
            <List className="w-4 h-4 text-muted-foreground" />
          </Link>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          <div className="h-4 w-px bg-border" />

          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-medium text-foreground">
              {initials}
            </div>
          )}

          <button onClick={onSignOut} className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors" title="Sign out">
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-12">
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          trackie<span className="text-muted-foreground font-normal">chan</span>
        </h1>
        <div className="flex items-center gap-1">
          <Link
            to="/subscriptions"
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
          >
            <List className="w-4 h-4 text-muted-foreground" />
          </Link>
          <button
            onClick={onAddClick}
            className="h-8 w-8 rounded-md flex items-center justify-center bg-foreground text-background"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-3 bg-card">
          <div className="flex items-center justify-center gap-2">
            <button onClick={onPrevMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-foreground font-medium min-w-[130px] text-center">
              {viewMode === "monthly" ? monthYear : currentMonth.getFullYear()}
            </span>
            <button onClick={onNextMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {viewMode === "monthly" ? (
              <><Grid3X3 className="w-3.5 h-3.5" /> Yearly</>
            ) : (
              <><CalendarDays className="w-3.5 h-3.5" /> Monthly</>
            )}
          </button>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[9px] font-medium text-foreground">
                  {initials}
                </div>
              )}
              <span className="text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</span>
            </div>
            <button onClick={onSignOut} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
