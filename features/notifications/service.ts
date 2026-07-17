import { listNotifications } from "./repository";

export async function getNotificationsList() {
  return listNotifications();
}
