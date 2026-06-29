export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  next_renewal: string; // ISO date (YYYY-MM-DD)
  category: string;
  color: string;
  created_at: string;
}

// 新增/编辑表单提交的数据(不含服务端生成的字段)
export type SubscriptionInput = Pick<
  Subscription,
  "name" | "amount" | "billing_cycle" | "next_renewal" | "category" | "color"
>;

export const CATEGORIES = [
  "Streaming",
  "Software",
  "Music",
  "Gaming",
  "News",
  "Productivity",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Streaming: "#ef4444",
  Software: "#3b82f6",
  Music: "#8b5cf6",
  Gaming: "#22c55e",
  News: "#f59e0b",
  Productivity: "#06b6d4",
  Other: "#6b7280",
};
