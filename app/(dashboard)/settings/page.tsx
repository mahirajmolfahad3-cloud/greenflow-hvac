"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SECTIONS = ["Company", "Branding", "Tax", "Email", "Working hours", "Appearance", "Security", "Storage"] as const;

export default function SettingsPage() {
  const [active, setActive] = useState<(typeof SECTIONS)[number]>("Company");

  return (
    <div>
      <PageHeader title="Settings" description="Configure GreenFlow for your company" />
      <div className="flex flex-col gap-4 md:flex-row">
        <nav className="flex gap-1 overflow-x-auto md:w-48 md:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-left text-sm ${active === s ? "bg-primary text-white" : "hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </nav>

        <Card className="flex-1">
          <CardHeader><CardTitle>{active}</CardTitle></CardHeader>
          <CardContent className="max-w-md space-y-3">
            {active === "Company" && (
              <>
                <div><Label>Company name</Label><Input defaultValue="GreenFlow HVAC" /></div>
                <div><Label>Support email</Label><Input defaultValue="support@greenflowhvac.com" /></div>
              </>
            )}
            {active === "Branding" && (
              <>
                <div><Label>Primary color</Label><Input type="color" defaultValue="#2f7a4f" className="h-10 w-20 p-1" /></div>
                <div><Label>Logo</Label><Input type="file" disabled /></div>
              </>
            )}
            {active === "Tax" && <div><Label>Default tax rate (%)</Label><Input defaultValue="8.25" /></div>}
            {active === "Email" && <div><Label>Sending domain</Label><Input placeholder="mail.greenflowhvac.com (placeholder)" disabled /></div>}
            {active === "Working hours" && (
              <>
                <div><Label>Open</Label><Input type="time" defaultValue="08:00" /></div>
                <div><Label>Close</Label><Input type="time" defaultValue="17:00" /></div>
              </>
            )}
            {active === "Appearance" && <p className="text-sm text-muted-foreground">Dark mode toggle lives in the top navigation bar.</p>}
            {active === "Security" && (
              <>
                <div><Label>Require 2FA for admins</Label><input type="checkbox" className="ml-2" /></div>
                <div><Label>Session timeout (minutes)</Label><Input defaultValue="60" /></div>
              </>
            )}
            {active === "Storage" && <p className="text-sm text-muted-foreground">Supabase Storage buckets: gf-customer-photos, gf-job-photos, gf-company-assets, gf-pdfs, gf-signatures.</p>}
            <Button>Save changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
