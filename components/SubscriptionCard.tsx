"use client";

import { Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { type Subscription } from "@/lib/types";
import { monthlyAmount, daysUntil, formatMoney } from "@/lib/calculations";
import { deleteSubscription } from "@/app/actions";
import SubscriptionFormDialog from "./SubscriptionFormDialog";

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const days = daysUntil(sub.next_renewal);
  const soon = days >= 0 && days <= 7;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* 分类色块 */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
        style={{ backgroundColor: sub.color }}
      >
        {sub.name.charAt(0).toUpperCase()}
      </div>

      {/* 主信息 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-slate-900 dark:text-white">{sub.name}</p>
          {soon && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {days === 0 ? "Renews today" : `${days}d`}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {sub.category} · renews {format(parseISO(sub.next_renewal), "MMM d, yyyy")}
        </p>
      </div>

      {/* 金额 */}
      <div className="text-right">
        <p className="font-semibold text-slate-900 dark:text-white">
          {formatMoney(sub.amount)}
        </p>
        <p className="text-xs text-slate-400">
          {sub.billing_cycle === "yearly"
            ? `${formatMoney(monthlyAmount(sub))}/mo`
            : "/mo"}
        </p>
      </div>

      {/* 操作 */}
      <div className="flex items-center gap-1">
        <SubscriptionFormDialog
          subscription={sub}
          trigger={
            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
              <Pencil className="h-4 w-4" />
            </button>
          }
        />
        <button
          onClick={() => {
            if (confirm(`Delete ${sub.name}?`)) deleteSubscription(sub.id);
          }}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
