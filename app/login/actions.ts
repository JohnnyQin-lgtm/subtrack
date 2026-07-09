"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage } from "@/lib/auth-errors";

async function getOrigin() {
  return (await headers()).get("origin")!;
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(error))}`);
  }
  redirect("/dashboard");
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(error))}`);
  }
  // Confirm email 打开后,signUp 不返回 session —— 提示去邮箱确认
  redirect(
    "/login?message=" +
      encodeURIComponent(
        "Account created! Check your email for a verification link to activate it."
      )
  );
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(error))}`);
  }
  if (data.url) redirect(data.url);
}

/**
 * Magic Link:发一封一次性登录链接到邮箱。
 * shouldCreateUser:false → 只对已存在账号生效,不自动建号(避免两个注册入口)。
 * 点击链接 → /auth/callback → exchangeCodeForSession → /dashboard。
 */
export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const email = String(formData.get("email") || "");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: false,
    },
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(error))}`);
  }
  redirect(
    "/login?message=" +
      encodeURIComponent("Check your email for a login link.")
  );
}

/** 重发验证邮件(给"没收到 / 没确认"的用户)。 */
export async function resendConfirmation(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const email = String(formData.get("email") || "");

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(authErrorMessage(error))}`);
  }
  redirect(
    "/login?message=" +
      encodeURIComponent("Verification email resent. Check your inbox.")
  );
}
