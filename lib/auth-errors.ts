/**
 * 把 Supabase Auth 返回的错误转成对用户友好的英文文案。
 * actions 和 UI 共用,避免散落。
 */
export function authErrorMessage(error: {
  message?: string;
  code?: string;
  status?: number;
}): string {
  const msg = (error.message ?? "").toLowerCase();

  // 速率限制:Supabase 自带发件约 3-4 封/小时
  if (
    error.status === 429 ||
    msg.includes("rate limit") ||
    msg.includes("too many") ||
    msg.includes("for security purposes")
  ) {
    return "Too many emails sent recently. Please wait a few minutes and try again.";
  }

  // 邮箱未确认(登录时)
  if (msg.includes("email not confirmed")) {
    return "Your email isn't confirmed yet — check your inbox for a verification link.";
  }

  // 凭证无效(密码错 / 账号不存在)
  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  // Magic link 对不存在账号(shouldCreateUser: false)
  if (msg.includes("user not found") || msg.includes("no user")) {
    return "No account found for this email. Sign up first.";
  }

  // 兜底:返回 Supabase 原始 message(已是英文)
  return error.message ?? "Something went wrong. Please try again.";
}
