"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { loginSchema, acceptInviteSchema } from "./validators";
import { ROLE_HOME_ROUTE, type Role } from "@/lib/permissions";
import { redirect } from "next/navigation";

export interface ActionResult {
  error?: string;
}

const DEMO_EMAIL = "demo@greenflowhvac.com";
const DEMO_PASSWORD = "Demo12345678";
const DEMO_NAME = "Demo User";

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

export async function loginWithDemoAction(): Promise<ActionResult> {
  const supabase = createClient();

  // Try signing in first — user may already exist.
  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  // If sign-in succeeds, redirect to dashboard.
  if (data?.user) {
    const role = (data.user.user_metadata?.role as Role) ?? "demo";
    redirect(ROLE_HOME_ROUTE[role]);
    return {};
  }

  // If the error is NOT "Invalid login credentials", something is wrong.
  if (error && !error.message.toLowerCase().includes("invalid login credentials")) {
    return { error: error.message };
  }

  // User doesn't exist yet — create the demo account on the fly.
  // Use the admin client which has the service_role key.
  const admin = createAdminClient();
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: DEMO_NAME,
      role: "demo",
    },
  });

  if (createError || !newUser?.user) {
    return { error: createError?.message ?? "Failed to create demo account." };
  }

  // Create profile row.
  const { error: profileError } = await supabase.from("gf_profiles").insert({
    id: newUser.user.id,
    full_name: DEMO_NAME,
    email: DEMO_EMAIL,
    role: "demo",
    status: "active",
    phone: "+1 (555) 999-9999",
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(newUser.user.id);
    return { error: profileError.message };
  }

  // Register as demo user in settings.
  await supabase.from("gf_demo_settings").insert({
    demo_user_id: newUser.user.id,
  });

  // Now sign in with the newly created user.
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (signInError || !signInData?.user) {
    return { error: signInError?.message ?? "Failed to sign in after creating demo account." };
  }

  redirect(ROLE_HOME_ROUTE["demo"]);
  return {};
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