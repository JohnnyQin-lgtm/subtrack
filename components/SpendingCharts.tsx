"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/types";

interface SpendingChartsProps {
  byCategory: { category: string; amount: number }[];
}

export default function SpendingCharts({ byCategory }: SpendingChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 分类占比饼图 */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
          Spending by category (monthly)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={byCategory}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name }: { name?: string }) => name ?? ""}
            >
              {byCategory.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}/mo`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 分类支出柱状图 */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
          Monthly cost by category
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byCategory}>
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}/mo`} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {byCategory.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "#6b7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
