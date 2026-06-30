import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { type Subscription } from "@/lib/types";
import {
  totalMonthly,
  totalYearly,
  renewingSoon,
  spendingByCategory,
} from "@/lib/calculations";
import StatCards from "@/components/StatCards";
import SpendingCharts from "@/components/SpendingCharts";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionFormDialog from "@/components/SubscriptionFormDialog";
import EmptyState from "@/components/EmptyState";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Server Component 直接查询 —— RLS 自动只返回当前用户的数据
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .order("next_renewal", { ascending: true });

  const subs = (data ?? []) as Subscription[];

  if (subs.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />
      <StatCards
        monthly={totalMonthly(subs)}
        yearly={totalYearly(subs)}
        count={subs.length}
        renewingSoon={renewingSoon(subs).length}
      />
      <SpendingCharts byCategory={spendingByCategory(subs)} />

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          All subscriptions ({subs.length})
        </h2>
        <div className="space-y-3">
          {subs.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track every recurring subscription in one place
        </p>
      </div>
      <SubscriptionFormDialog
        trigger={
          <Button>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />
    </div>
  );
}
