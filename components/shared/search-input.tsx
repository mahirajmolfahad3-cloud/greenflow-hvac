"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
