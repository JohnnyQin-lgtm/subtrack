import Link from "next/link";
import { ArrowRight, BarChart3, Bell, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className="text-indigo-600">◆</span> SubTrack
        </span>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center sm:pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Never get surprised by a renewal again
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          Track all your subscriptions in one place. See exactly how much you
          spend each month, what&apos;s renewing soon, and where your money goes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-12 sm:grid-cols-3">
        <Feature
          icon={<BarChart3 className="h-5 w-5" />}
          title="Spending insights"
          desc="Monthly & yearly totals, plus a breakdown by category."
        />
        <Feature
          icon={<Bell className="h-5 w-5" />}
          title="Renewal alerts"
          desc="See at a glance which subscriptions renew in the next 7 days."
        />
        <Feature
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Private & secure"
          desc="Your data is isolated per account with row-level security."
        />
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-800">
        Built with Next.js, Supabase &amp; Tailwind · Demo project
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </CardContent>
    </Card>
  );
}
