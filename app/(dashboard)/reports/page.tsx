"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const jobsPerWeek = [
  { week: "Wk 1", jobs: 12 }, { week: "Wk 2", jobs: 18 }, { week: "Wk 3", jobs: 9 },
  { week: "Wk 4", jobs: 21 }, { week: "Wk 5", jobs: 15 },
];
const revenueTrend = [
  { month: "Mar", revenue: 24000 }, { month: "Apr", revenue: 31000 }, { month: "May", revenue: 27500 },
  { month: "Jun", revenue: 35200 }, { month: "Jul", revenue: 29800 },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Operational and financial trends"
        actions={<Button variant="secondary"><Download className="h-4 w-4" /> Export (placeholder)</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <select className="rounded-md border border-border bg-background px-2 py-1"><option>Last 30 days</option><option>Last 90 days</option></select>
        <select className="rounded-md border border-border bg-background px-2 py-1"><option>All technicians</option></select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Jobs completed per week</CardTitle></CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsPerWeek}>
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="jobs" fill="#2f7a4f" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue trend</CardTitle></CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2f7a4f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Charts use placeholder data. No reporting engine is wired up yet — see the `reports` feature module for where real aggregation queries belong.
      </p>
    </div>
  );
}
