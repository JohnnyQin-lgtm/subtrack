import { formatMoney } from "@/lib/calculations";

interface StatCardsProps {
  monthly: number;
  yearly: number;
  count: number;
  renewingSoon: number;
}

export default function StatCards({ monthly, yearly, count, renewingSoon }: StatCardsProps) {
  const cards = [
    { label: "Monthly spend", value: formatMoney(monthly), accent: "text-indigo-600" },
    { label: "Yearly spend", value: formatMoney(yearly), accent: "text-violet-600" },
    { label: "Active subscriptions", value: String(count), accent: "text-emerald-600" },
    {
      label: "Renewing in 7 days",
      value: String(renewingSoon),
      accent: renewingSoon > 0 ? "text-amber-600" : "text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
