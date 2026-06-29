"use client";

import { Sparkles } from "lucide-react";
import { seedSampleData } from "@/app/actions";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
        <Sparkles className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        No subscriptions yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Add your first subscription, or load some sample data to see how it works.
      </p>
      <form action={seedSampleData} className="mt-5">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Load sample data
        </button>
      </form>
    </div>
  );
}
