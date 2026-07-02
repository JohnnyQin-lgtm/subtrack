# 配置指南:把 SubTrack 连上 Supabase(含 Google 登录)

> 照着从头做到尾,大约 20–30 分钟。全程网页点点,不用命令行。
> 卡在任何一步,把报错截图发我。

---

## 第 1 步:建 Supabase 项目(3 分钟)

1. 打开 https://supabase.com → 右上角 **Start your project** → 用 **GitHub 账号登录**(没有就现注册)
2. 进入后台点 **New project**
3. 填写:
   - **Name**:`subtrack`(随便)
   - **Database Password**:点 **Generate a password** 自动生成,**复制存到安全的地方**(以后连数据库要用,虽然这个 demo 用不到,但别丢)
   - **Region**:选离你近的(如 `Southeast Asia (Singapore)`)
4. 点 **Create new project**,等 1–2 分钟项目初始化完成

---

## 第 2 步:建表 + 开启安全策略(2 分钟)

1. 项目建好后,看左侧菜单 → 点 **SQL Editor**(图标像 `>_`)
2. 点 **New query**
3. 打开项目里的 `supabase-schema.sql` 文件,**全选复制**里面所有内容
4. 粘贴到 SQL Editor 的输入框
5. 点右下角 **Run**(或按 Cmd+Enter)
6. 看到 `Success. No rows returned` 就对了 ✅

> 这一步创建了 `subscriptions` 表,并开启了行级安全(RLS)—— 保证每个用户只能看到自己的数据。

**验证**:左侧点 **Table Editor**,应该能看到 `subscriptions` 表。

---

## 第 3 步:拿到 URL 和 Key,填进项目(2 分钟)

1. 左侧菜单最下面 → **Project Settings**(齿轮图标)→ **API**（或 **Data API**）
2. 找到这两个值:
   - **Project URL**(形如 `https://xxxxx.supabase.co`)
   - **anon / public** key（**Project API Keys** 里那个标着 `anon` `public` 的长字符串;**不要**复制 `service_role`,那个是机密)
3. 回到项目文件夹,把 `.env.local.example` 复制一份改名为 `.env.local`,填进去:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...(你复制的 anon key)
```

> 我可以帮你建这个文件——你把两个值发我(anon key 是公开可暴露的,发我没关系),或者你自己填。

---

## 第 4 步:开启邮箱登录 + 关掉邮箱确认(方便本地测试)(2 分钟)

1. 左侧 → **Authentication** → **Sign In / Providers**(或 **Providers**)
2. **Email** 默认是开的,确认它是 **Enabled** ✅
3. （可选,强烈建议本地测试时做)为了不用真收确认邮件就能登录:
   - 找到 **Email** 设置里的 **Confirm email** 开关 → **关掉**
   - 这样注册后能立刻登录,方便你测试。上线给客户看时可以再打开。

---

## 第 5 步:配置 Google 登录(10–15 分钟,稍绕但一次搞定)

Google 登录需要在 **Google Cloud** 建一套 OAuth 凭据,再填回 Supabase。分两半:

### 5a. 先拿到 Supabase 的「回调地址」

1. Supabase 左侧 → **Authentication** → **Providers** → 点 **Google**
2. 把它 **Enabled** 打开
3. 复制页面上显示的 **Callback URL (for OAuth)**,形如:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   先存着,一会儿要填给 Google。**这个页面先别关。**

### 5b. 在 Google Cloud 建 OAuth 凭据

1. 打开 https://console.cloud.google.com → 用 Google 账号登录
2. 顶部项目下拉 → **New Project** → 名字填 `SubTrack` → **Create**,然后确保顶部选中的是这个新项目
3. 左侧菜单(汉堡图标)→ **APIs & Services** → **OAuth consent screen**
   - **User Type** 选 **External** → **Create**
   - **App name**:`SubTrack`;**User support email**:选你的邮箱;**Developer contact**:填你的邮箱
   - 其余留空,一路 **Save and Continue** 到底,最后 **Back to Dashboard**
   - （如果看到 **Publishing status: Testing**,没关系,测试阶段够用;想让别人也能登录,后面可点 **Publish app**)
4. 左侧 → **APIs & Services** → **Credentials** → 顶部 **+ Create Credentials** → **OAuth client ID**
   - **Application type**:**Web application**
   - **Name**:`SubTrack Web`
   - **Authorized redirect URIs** → 点 **+ Add URI** → 粘贴你在 5a 复制的那个 Supabase Callback URL（`https://xxxxx.supabase.co/auth/v1/callback`)
   - 点 **Create**
5. 弹窗会显示 **Client ID** 和 **Client Secret**,**两个都复制**

### 5c. 填回 Supabase

1. 回到 Supabase 的 Google provider 页面(5a 那个)
2. 把刚拿到的 **Client ID** 和 **Client Secret** 分别粘进对应输入框
3. 点 **Save**

---

## 第 6 步:本地跑起来测试(2 分钟)

在项目文件夹里:

```
npm run dev
```

打开 http://localhost:3000

**依次测试**:
1. 落地页 → 点 **Sign in**
2. 用邮箱注册一个账号 → 应该能进 dashboard
3. dashboard 是空的 → 点 **Load sample data** → 立刻出现卡片和图表 ✅
4. 加一条订阅、编辑、删除,看数据实时更新
5. 退出 → 再点 **Continue with Google** → 应该跳 Google 授权 → 授权后回到 dashboard ✅

> **本地 Google 登录的注意**:Supabase 的 Google 回调走的是 Supabase 域名,所以本地 `localhost` 也能用,不用额外配 localhost。但有些情况需要在 Supabase → Authentication → **URL Configuration** 里把 `http://localhost:3000` 加进 **Redirect URLs**。如果 Google 登录后没跳回来,就去加这一条。

---

## 常见坑速查

| 现象 | 原因 / 解决 |
|------|------|
| 登录后白屏 / `Could not authenticate` | `.env.local` 的 URL 或 key 填错了,或没重启 `npm run dev` |
| Google 登录报 `redirect_uri_mismatch` | Google Cloud 里的 Authorized redirect URI 和 Supabase Callback URL 不完全一致(注意结尾 `/auth/v1/callback`) |
| 注册后要收邮件才能登录 | 第 4 步的 Confirm email 没关(本地测试建议关) |
| 能登录但加订阅没反应 | 第 2 步 SQL 没跑成功,表或 RLS 策略没建好 —— 重跑一遍 `supabase-schema.sql` |
| Google 登录后没跳回 | 去 Supabase → Authentication → URL Configuration 把 `http://localhost:3000` 加进 Redirect URLs |

---

## 部署到 Vercel 时要补的(以后做,先记着)

上线时把 `localhost:3000` 换成你的 Vercel 域名,需要更新三处:
1. Google Cloud → Authorized redirect URIs 保持 Supabase callback 不变(不用改)
2. Supabase → Authentication → URL Configuration → **Site URL** 改成 Vercel 域名
3. Supabase → Redirect URLs 里加上 Vercel 域名
4. Vercel 项目设置里填 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 两个环境变量
