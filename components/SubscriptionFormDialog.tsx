"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, type Subscription } from "@/lib/types";
import { addSubscription, updateSubscription } from "@/app/actions";

interface Props {
  /** 传入则为编辑模式,不传为新增 */
  subscription?: Subscription;
  trigger: React.ReactNode;
}

export default function SubscriptionFormDialog({ subscription, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(subscription);

  // Server Action 包一层:提交后关闭弹窗
  async function handleSubmit(formData: FormData) {
    if (isEdit && subscription) {
      await updateSubscription(subscription.id, formData);
    } else {
      await addSubscription(formData);
    }
    setOpen(false);
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isEdit ? "Edit subscription" : "Add subscription"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <Field label="Name">
                <input
                  name="name"
                  required
                  defaultValue={subscription?.name}
                  placeholder="Netflix"
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (USD)">
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={subscription?.amount}
                    placeholder="15.49"
                    className="input"
                  />
                </Field>
                <Field label="Billing cycle">
                  <select
                    name="billing_cycle"
                    defaultValue={subscription?.billing_cycle ?? "monthly"}
                    className="input"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Next renewal">
                  <input
                    name="next_renewal"
                    type="date"
                    required
                    defaultValue={subscription?.next_renewal}
                    className="input"
                  />
                </Field>
                <Field label="Category">
                  <select
                    name="category"
                    defaultValue={subscription?.category ?? "Other"}
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {isEdit ? "Save changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}
