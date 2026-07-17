export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="flex justify-between text-sm">
          <span>
            <strong>{entry.actor}</strong> {entry.action}
          </span>
          <span className="text-muted-foreground">{entry.timestamp}</span>
        </li>
      ))}
    </ul>
  );
}
