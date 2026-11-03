"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchFieldProps {
  value: string;
  placeholder: string;
  // Label untuk pembaca layar; bawaannya mengikuti placeholder.
  label?: string;
  onChange: (value: string) => void;
  inputClassName?: string;
}

export default function SearchField({ value, placeholder, label, onChange, inputClassName = "" }: SearchFieldProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        aria-label={label ?? placeholder.replace(/\.+$/, "")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 pl-10 ${inputClassName}`}
      />
    </div>
  );
}
