"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit subscription" : "Add subscription"}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={subscription?.name}
              placeholder="Netflix"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={subscription?.amount}
                placeholder="15.49"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="billing_cycle">Billing cycle</Label>
              <Select
                name="billing_cycle"
                defaultValue={subscription?.billing_cycle ?? "monthly"}
              >
                <SelectTrigger id="billing_cycle" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="next_renewal">Next renewal</Label>
              <Input
                id="next_renewal"
                name="next_renewal"
                type="date"
                required
                defaultValue={subscription?.next_renewal}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={subscription?.category ?? "Other"}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton pendingText="Saving...">
              {isEdit ? "Save changes" : "Add"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
