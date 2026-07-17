import { redirect } from "next/navigation";

// Root just forwards to login; middleware sends authenticated users to
// their role-appropriate home route from there.
export default function RootPage() {
  redirect("/login");
}
