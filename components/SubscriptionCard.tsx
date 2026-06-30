"use client";

import { Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Subscription } from "@/lib/types";
import { monthlyAmount, daysUntil, formatMoney } from "@/lib/calculations";
import { deleteSubscription } from "@/app/actions";
import SubscriptionFormDialog from "./SubscriptionFormDialog";

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const days = daysUntil(sub.next_renewal);
  const soon = days >= 0 && days <= 7;

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
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
          <p className="truncate font-medium">{sub.name}</p>
          {soon && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">
              {days === 0 ? "Renews today" : `${days}d`}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {sub.category} · renews {format(parseISO(sub.next_renewal), "MMM d, yyyy")}
        </p>
      </div>

      {/* 金额 */}
      <div className="text-right">
        <p className="font-semibold">{formatMoney(sub.amount)}</p>
        <p className="text-xs text-muted-foreground">
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
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-red-600"
          onClick={() => {
            if (confirm(`Delete ${sub.name}?`)) deleteSubscription(sub.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
