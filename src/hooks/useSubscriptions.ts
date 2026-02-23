import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/lib/mockData";

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("due_day", { ascending: true });

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        amount: Number(row.amount),
        currency: row.currency,
        cycle: row.cycle as "monthly" | "yearly",
        dueDay: row.due_day,
        color: row.color,
        initial: row.initial,
        autopay: row.autopay,
        paymentSource: row.payment_source,
        startDate: row.start_date,
        endDate: row.end_date,
        createdAt: row.created_at,
      }));
    },
  });

  const addMutation = useMutation({
    mutationFn: async (sub: Omit<Subscription, "id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        name: sub.name,
        amount: sub.amount,
        currency: sub.currency,
        cycle: sub.cycle,
        due_day: sub.dueDay,
        color: sub.color,
        initial: sub.initial,
        autopay: sub.autopay,
        payment_source: sub.paymentSource,
        start_date: sub.startDate || new Date().toISOString().split("T")[0],
        end_date: sub.endDate || null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
  });

  const allData = query.data || [];
  const subscriptions: Subscription[] = allData.map(({ createdAt, ...rest }: any) => rest);
  const subscriptionsWithDates = allData;

  return {
    subscriptions,
    subscriptionsWithDates,
    isLoading: query.isLoading,
    addSubscription: addMutation.mutateAsync,
    deleteSubscription: deleteMutation.mutateAsync,
  };
}
