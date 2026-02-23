import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Subscription } from "@/lib/mockData";

export function useNotificationReminders(subscriptions: Subscription[]) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current || subscriptions.length === 0) return;
    hasShown.current = true;

    const today = new Date().getDate();

    const dueToday = subscriptions.filter((s) => s.dueDay === today);
    const dueTomorrow = subscriptions.filter((s) => s.dueDay === today + 1);

    dueToday.forEach((s) => {
      toast({
        title: `${s.name} is due today`,
        description: `₹${s.amount.toLocaleString("en-IN")} — ${s.paymentSource}`,
      });
    });

    dueTomorrow.forEach((s) => {
      toast({
        title: `${s.name} is due tomorrow`,
        description: `₹${s.amount.toLocaleString("en-IN")} — ${s.paymentSource}`,
      });
    });

    // Browser push notifications
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    if ("Notification" in window && Notification.permission === "granted") {
      dueToday.forEach((s) => {
        new Notification(`${s.name} is due today`, {
          body: `₹${s.amount.toLocaleString("en-IN")} — ${s.paymentSource}`,
          icon: "/favicon.ico",
        });
      });
      dueTomorrow.forEach((s) => {
        new Notification(`${s.name} is due tomorrow`, {
          body: `₹${s.amount.toLocaleString("en-IN")} — ${s.paymentSource}`,
          icon: "/favicon.ico",
        });
      });
    }
  }, [subscriptions]);
}
