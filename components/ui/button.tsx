import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary: "bg-muted text-foreground hover:opacity-80",
  ghost: "bg-transparent hover:bg-muted",
  destructive: "bg-red-600 text-white hover:opacity-90",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
