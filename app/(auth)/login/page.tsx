"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { loginAction, loginWithDemoAction, signInWithGoogleAction } from "@/features/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <Card>
      <h1 className="mb-4 text-lg font-semibold">Log in</h1>
      <form action={formAction} className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <Button type="submit" className="w-full">Log in</Button>
      </form>
      <form action={signInWithGoogleAction} className="mt-2">
        <Button type="submit" variant="secondary" className="w-full">
          Continue with Google
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <form action={loginWithDemoAction}>
          <button type="submit" className="text-primary underline hover:text-primary/80">
            Try Demo
          </button>
        </form>
        <Link href="/forgot-password" className="text-muted-foreground underline">
          Forgot password?
        </Link>
      </div>
    </Card>
  );
}