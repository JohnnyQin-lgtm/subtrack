import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Subscription } from "./types";

/** 把任意计费周期换算成「每月」花费 */
export function monthlyAmount(sub: Pick<Subscription, "amount" | "billing_cycle">): number {
  return sub.billing_cycle === "yearly" ? sub.amount / 12 : sub.amount;
}

/** 全部订阅的月度总支出 */
export function totalMonthly(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + monthlyAmount(s), 0);
}

/** 全部订阅的年度总支出 */
export function totalYearly(subs: Subscription[]): number {
  return totalMonthly(subs) * 12;
}

/** 距离今天的天数(负数=已过期) */
export function daysUntil(isoDate: string, today: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(isoDate), today);
}

/** N 天内即将续费的订阅(默认 7 天) */
export function renewingSoon(
  subs: Subscription[],
  withinDays = 7,
  today: Date = new Date()
): Subscription[] {
  return subs.filter((s) => {
    const d = daysUntil(s.next_renewal, today);
    return d >= 0 && d <= withinDays;
  });
}

/** 按分类汇总月度支出(用于饼图) */
export function spendingByCategory(
  subs: Subscription[]
): { category: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const s of subs) {
    map.set(s.category, (map.get(s.category) ?? 0) + monthlyAmount(s));
  }
  return [...map.entries()].map(([category, amount]) => ({
    category,
    amount: Math.round(amount * 100) / 100,
  }));
}

/** 格式化金额为 $x.xx */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
