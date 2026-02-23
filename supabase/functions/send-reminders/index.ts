import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date().getDate();
    const tomorrow = today + 1;

    // Get subscriptions due today or tomorrow
    const { data: subs, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*, user_id")
      .or(`due_day.eq.${today},due_day.eq.${tomorrow}`);

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ message: "No reminders to send" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group by user
    const byUser: Record<string, typeof subs> = {};
    for (const sub of subs) {
      if (!byUser[sub.user_id]) byUser[sub.user_id] = [];
      byUser[sub.user_id].push(sub);
    }

    const results: string[] = [];

    for (const [userId, userSubs] of Object.entries(byUser)) {
      // Get user email
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (!userData?.user?.email) continue;

      const email = userData.user.email;
      const lines = userSubs.map((s) => {
        const when = s.due_day === today ? "today" : "tomorrow";
        return `• ${s.name} — ₹${Number(s.amount).toLocaleString("en-IN")} is due ${when}`;
      });

      const subject = `TrackieChan: ${userSubs.length} subscription${userSubs.length > 1 ? "s" : ""} due`;
      const body = `Hey!\n\nHere are your upcoming subscription renewals:\n\n${lines.join("\n")}\n\n— TrackieChan`;

      // Use Supabase's built-in email via auth.admin
      // For production, integrate Resend or similar
      console.log(`Would send email to ${email}:\nSubject: ${subject}\n${body}`);
      results.push(`Logged reminder for ${email} (${userSubs.length} subs)`);
    }

    return new Response(JSON.stringify({ sent: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
