export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="border-l border-border pl-4">
      {events.map((event) => (
        <li key={event.id} className="relative mb-4 last:mb-0">
          <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
          <p className="text-sm font-medium">{event.label}</p>
          <p className="text-xs text-muted-foreground">{event.timestamp}</p>
        </li>
      ))}
    </ol>
  );
}
