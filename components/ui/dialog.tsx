"use client";

import { type ReactNode } from "react";

/**
 * Minimal placeholder dialog (no portal/animation libs) — enough to
 * demonstrate the pattern. Swap for full shadcn/ui Dialog when adding
 * real design polish.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
