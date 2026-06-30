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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLORS } from "@/lib/types";

interface SpendingChartsProps {
  byCategory: { category: string; amount: number }[];
}

export default function SpendingCharts({ byCategory }: SpendingChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 分类占比饼图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Spending by category (monthly)
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* 分类支出柱状图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Monthly cost by category
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
