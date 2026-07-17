import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const inviteEmployeeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["dispatcher", "technician", "accountant"]),
});

export const acceptInviteSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;