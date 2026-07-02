"use client";

import { Trash2 } from "lucide-react";
import { clearAllSubscriptions } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

export default function ClearAllButton() {
  return (
    <form
      action={clearAllSubscriptions}
      onSubmit={(e) => {
        if (!confirm("Delete ALL subscriptions? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <SubmitButton
        variant="ghost"
        size="sm"
        pendingText="Clearing..."
        className="text-muted-foreground hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" /> Clear all
      </SubmitButton>
    </form>
  );
}
