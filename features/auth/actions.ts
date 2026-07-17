"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, acceptInviteSchema } from "./validators";
import { ROLE_HOME_ROUTE, type Role } from "@/lib/permissions";
import { redirect } from "next/navigation";

export interface ActionResult {
  error?: string;
}

export async function loginAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const role = (data.user?.user_metadata?.role as Role) ?? "technician";
  redirect(ROLE_HOME_ROUTE[role]);
}

export async function loginWithDemoAction() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "demo@greenflowhvac.com",
    password: "Demo12345678", // seeded demo account password
  });
  if (error) return { error: error.message };

  const role = (data.user?.user_metadata?.role as Role) ?? "demo";
  redirect(ROLE_HOME_ROUTE[role]);
}

export async function signInWithGoogleAction() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback` },
  });
  if (error) throw error;
  if (data.url) redirect(data.url);
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function acceptInviteAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = acceptInviteSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = createClient();

  // The user should be authenticated via the invite link already
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Invalid invitation link. Please request a new one." };

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (updateError) return { error: updateError.message };

  // Update profile status from invited to active
  const { error: profileError } = await supabase
    .from("gf_profiles")
    .update({ status: "active" })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const role = (user.user_metadata?.role as Role) ?? "technician";
  redirect(ROLE_HOME_ROUTE[role]);
}