"use client";

import { useFormState } from "react-dom";
import { acceptInviteAction } from "@/features/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AcceptInvitePage() {
  const [state, formAction] = useFormState(acceptInviteAction, {});

  return (
    <Card>
      <h1 className="mb-4 text-lg font-semibold">Set your password</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        You've been invited to join GreenFlow HVAC. Choose a password to activate your account.
      </p>
      <form action={formAction} className="space-y-3">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required placeholder="At least 8 characters" />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Repeat your password" />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <Button type="submit" className="w-full">Activate account</Button>
      </form>
    </Card>
  );
}