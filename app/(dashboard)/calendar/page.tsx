"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOCK_JOBS } from "@/lib/mock-data/jobs";

const VIEWS = ["Month", "Week", "Day"] as const;
type View = (typeof VIEWS)[number];

const PRIORITY_COLOR: Record<string, string> = {
  low: "bg-gray-200",
  medium: "bg-blue-200",
  high: "bg-amber-200",
  emergency: "bg-red-200",
};

/**
 * Calendar view. Drag-and-drop rescheduling is architected for (each job
 * card is a draggable candidate, each day cell a drop target) but the
 * actual DnD wiring is a placeholder — a real implementation would use
 * something like @dnd-kit here.
 */
export default function CalendarPage() {
  const [view, setView] = useState<View>("Month");
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Scheduled jobs, color-coded by priority"
        actions={
          <div className="flex gap-1">
            {VIEWS.map((v) => (
              <Button key={v} variant={view === v ? "primary" : "secondary"} onClick={() => setView(v)}>
                {v}
              </Button>
            ))}
          </div>
        }
      />

      {view === "Month" ? (
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const jobsForDay = MOCK_JOBS.filter(
              (j) => j.scheduledFor && new Date(j.scheduledFor).getDate() === day
            );
            return (
              <Card key={day} className="min-h-20 p-2" draggable={false}>
                <p className="mb-1 text-xs text-muted-foreground">{day}</p>
                {jobsForDay.map((j) => (
                  <div
                    key={j.id}
                    draggable
                    className={`mb-1 truncate rounded px-1.5 py-0.5 text-xs ${PRIORITY_COLOR[j.priority]}`}
                    title={j.title}
                  >
                    {j.title}
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          {view} view — same drag-and-drop-ready architecture as Month view.
        </Card>
      )}
    </div>
  );
}
