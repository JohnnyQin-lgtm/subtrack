"use client";

import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import SubmitButton from "@/components/SubmitButton";
import { seedSampleData } from "@/app/actions";

export default function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
        <Sparkles className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold">No subscriptions yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add your first subscription, or load some sample data to see how it works.
      </p>
      <form action={seedSampleData} className="mt-5">
        <SubmitButton pendingText="Loading...">Load sample data</SubmitButton>
      </form>
    </Card>
  );
}
