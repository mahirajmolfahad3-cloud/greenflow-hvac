"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { inviteEmployeeSchema } from "@/features/auth/validators";
import { revalidatePath } from "next/cache";

export interface EmployeeActionResult {
  error?: string;
  success?: boolean;
}

export async function inviteEmployeeAction(_: EmployeeActionResult, formData: FormData): Promise<EmployeeActionResult> {
  const parsed = inviteEmployeeSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = createClient();

  // 1. Verify the current user is an admin
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return { error: "You must be logged in." };

  const currentRole = currentUser.user_metadata?.role as string;
  if (currentRole !== "admin") return { error: "Only admins can invite employees." };

  // 2. Check if employee already exists
  const { data: existing } = await supabase
    .from("gf_profiles")
    .select("id")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (existing) return { error: "An account with this email already exists." };

  // 3. Create the auth user via Supabase Admin API (requires service_role key)
  const admin = createAdminClient();
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    email_confirm: true,
    password: crypto.randomUUID(),
    user_metadata: {
      full_name: parsed.data.fullName,
      role: parsed.data.role,
    },
  });

  if (createError || !newUser.user) return { error: createError?.message ?? "Failed to create user." };

  // 4. Create the gf_profiles row
  const { error: profileError } = await supabase.from("gf_profiles").insert({
    id: newUser.user.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    role: parsed.data.role,
    status: "invited",
    invited_at: new Date().toISOString(),
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(newUser.user.id);
    return { error: profileError.message };
  }

  // 5. Send the invitation email
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/accept-invite`,
  });

  if (inviteError) return { error: inviteError.message };

  revalidatePath("/employees");
  return { success: true };
}

export async function updateEmployeeStatusAction(_: EmployeeActionResult, formData: FormData): Promise<EmployeeActionResult> {
  const employeeId = formData.get("employeeId") as string;
  const newStatus = formData.get("status") as string;

  if (!employeeId || !["active", "suspended", "archived"].includes(newStatus)) {
    return { error: "Invalid request." };
  }

  const supabase = createClient();

  // Verify admin
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return { error: "You must be logged in." };
  if (currentUser.user_metadata?.role !== "admin") return { error: "Only admins can manage employees." };

  const updateData: Record<string, any> = { status: newStatus };
  if (newStatus === "archived") {
    updateData.archived_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("gf_profiles")
    .update(updateData)
    .eq("id", employeeId);

  if (error) return { error: error.message };

  // If archiving, also disable the auth user
  if (newStatus === "archived") {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(employeeId, { ban_duration: "0" });
  }

  // If reactivating, unban the user
  if (newStatus === "active") {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(employeeId, { ban_duration: "none" });
  }

  revalidatePath("/employees");
  return { success: true };
}

export async function resendInviteAction(_: EmployeeActionResult, formData: FormData): Promise<EmployeeActionResult> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const supabase = createClient();

  const admin = createAdminClient();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/accept-invite`,
  });

  if (inviteError) return { error: inviteError.message };

  return { success: true };
}