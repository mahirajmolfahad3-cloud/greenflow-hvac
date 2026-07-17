import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNotificationsList } from "@/features/notifications/service";
import { EmptyState } from "@/components/shared/empty-state";

export default async function NotificationsPage() {
  const notifications = await getNotificationsList();

  return (
    <div>
      <PageHeader title="Notifications" description="System and job alerts" />
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={!n.read ? "border-primary" : ""}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                </div>
                {!n.read && <Badge className="bg-primary text-white">New</Badge>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
