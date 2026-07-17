"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(email);
    setSent(true);
  }

  return (
    <Card>
      <h1 className="mb-4 text-lg font-semibold">Reset password</h1>
      {sent ? (
        <p className="text-sm">If an account exists for {email}, a reset link has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      )}
    </Card>
  );
}
