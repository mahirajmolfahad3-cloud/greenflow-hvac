import LandingPage from "@/app/(landing)/page";

// Root just forwards to login for authenticated users; middleware sends authenticated users to
// their role-appropriate home route from there.
export default function RootPage() {
  return <LandingPage />;
}
