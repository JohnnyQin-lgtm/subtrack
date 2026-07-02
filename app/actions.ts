"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDays, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_COLORS, type SubscriptionInput } from "@/lib/types";

/** 从 FormData 解析订阅输入 */
function parseSubscriptionForm(formData: FormData): SubscriptionInput {
  const category = String(formData.get("category") || "Other");
  return {
    name: String(formData.get("name") || "").trim(),
    amount: Number(formData.get("amount") || 0),
    billing_cycle: formData.get("billing_cycle") === "yearly" ? "yearly" : "monthly",
    next_renewal: String(formData.get("next_renewal") || ""),
    category,
    color: CATEGORY_COLORS[category] ?? "#6b7280",
  };
}

export async function addSubscription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const input = parseSubscriptionForm(formData);
  if (!input.name || !input.next_renewal) return;

  await supabase.from("subscriptions").insert({ ...input, user_id: user.id });
  revalidatePath("/dashboard");
}

export async function updateSubscription(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const input = parseSubscriptionForm(formData);
  if (!input.name || !input.next_renewal) return;

  // RLS 保证只能改自己的;这里再带上 user_id 双保险
  await supabase
    .from("subscriptions")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("subscriptions").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/** 一键填充示例数据 —— 方便客户试用时立刻看到效果 */
export async function seedSampleData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date();
  const samples: SubscriptionInput[] = [
    { name: "Netflix", amount: 15.49, billing_cycle: "monthly", next_renewal: format(addDays(today, 4), "yyyy-MM-dd"), category: "Streaming", color: CATEGORY_COLORS.Streaming },
    { name: "Spotify", amount: 11.99, billing_cycle: "monthly", next_renewal: format(addDays(today, 12), "yyyy-MM-dd"), category: "Music", color: CATEGORY_COLORS.Music },
    { name: "GitHub Copilot", amount: 100, billing_cycle: "yearly", next_renewal: format(addDays(today, 45), "yyyy-MM-dd"), category: "Software", color: CATEGORY_COLORS.Software },
    { name: "Notion Plus", amount: 96, billing_cycle: "yearly", next_renewal: format(addDays(today, 90), "yyyy-MM-dd"), category: "Productivity", color: CATEGORY_COLORS.Productivity },
    { name: "Disney+", amount: 13.99, billing_cycle: "monthly", next_renewal: format(addDays(today, 6), "yyyy-MM-dd"), category: "Streaming", color: CATEGORY_COLORS.Streaming },
    { name: "Xbox Game Pass", amount: 16.99, billing_cycle: "monthly", next_renewal: format(addDays(today, 20), "yyyy-MM-dd"), category: "Gaming", color: CATEGORY_COLORS.Gaming },
  ];

  // 防重复(第一道):已有订阅就直接返回 —— 处理顺序连点的常见情况
  const { count } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (count && count > 0) return;

  // 防重复(第二道,数据库层根治):is_sample=true 的行受部分唯一索引
  // (user_id, name) 约束。真正并发的两次插入,第一次成功,第二次触发
  // 唯一冲突(错误码 23505),这里静默忽略 —— 保证幂等,不弹错。
  const { error } = await supabase
    .from("subscriptions")
    .insert(samples.map((s) => ({ ...s, user_id: user.id, is_sample: true })));
  if (error && error.code !== "23505") throw error;

  revalidatePath("/dashboard");
}

/** 清空当前用户的全部订阅(方便重置演示数据) */
export async function clearAllSubscriptions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("subscriptions").delete().eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
