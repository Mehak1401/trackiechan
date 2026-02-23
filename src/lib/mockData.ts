export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "monthly" | "yearly";
  dueDay: number;
  color: string;
  initial: string;
  autopay: boolean;
  paymentSource: string;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string | null; // ISO date string or null if ongoing
}

export interface Notification {
  id: string;
  type: "upcoming" | "paid";
  title: string;
  message: string;
  time: string;
}

// Brand color/initial map used across add form and display
export const KNOWN_BRANDS: Record<string, { color: string; initial: string }> = {
  netflix: { color: "#E50914", initial: "N" },
  spotify: { color: "#1DB954", initial: "S" },
  "youtube premium": { color: "#FF0000", initial: "Y" },
  claude: { color: "#D4A574", initial: "C" },
  "claude code": { color: "#D4A574", initial: "C" },
  kimi: { color: "#8B5CF6", initial: "K" },
  "kimi ai": { color: "#8B5CF6", initial: "K" },
  notion: { color: "#FFFFFF", initial: "N" },
  figma: { color: "#A259FF", initial: "F" },
  linear: { color: "#5E6AD2", initial: "L" },
  "icloud+": { color: "#007AFF", initial: "i" },
  "apple music": { color: "#FA243C", initial: "A" },
  "amazon prime": { color: "#00A8E1", initial: "A" },
  chatgpt: { color: "#10A37F", initial: "C" },
  "disney+": { color: "#113CCF", initial: "D" },
  hotstar: { color: "#1F2937", initial: "H" },
  jio: { color: "#0A3A7D", initial: "J" },
};
