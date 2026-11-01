"use client";

import { SlidersHorizontal } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import FilterChips, { FilterOption } from "./FilterChips";

export interface FilterGroup {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface FilterToggle {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface FilterPanelProps {
  groups: FilterGroup[];
  toggles?: FilterToggle[];
}

const triggerClassName =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent data-[popup-open]:border-primary";

function ToggleRow({ toggle }: { toggle: FilterToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-medium">
      <span>{toggle.label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={toggle.checked}
        aria-label={toggle.label}
        onClick={() => toggle.onChange(!toggle.checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          toggle.checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            toggle.checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function PanelBody({ groups, toggles = [] }: FilterPanelProps) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <FilterChips
          key={group.label}
          label={group.label}
          options={group.options}
          active={group.value}
          onChange={group.onChange}
        />
      ))}
      {toggles.length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          {toggles.map((toggle) => (
            <ToggleRow key={toggle.label} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}

// Tombol "Filter" untuk filter tambahan: popover di desktop, sheet dari bawah di mobile.
export default function FilterPanel({ groups, toggles = [] }: FilterPanelProps) {
  const activeCount =
    groups.filter((group) => group.value !== "").length +
    toggles.filter((toggle) => toggle.checked).length;
  const label = activeCount > 0 ? `Filter (${activeCount})` : "Filter";

  const triggerContent = (
    <>
      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
      {label}
    </>
  );

  return (
    <>
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger className={triggerClassName}>{triggerContent}</PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} className="w-[420px] max-w-[calc(100vw-2rem)] p-4 text-sm">
            <PanelBody groups={groups} toggles={toggles} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className={triggerClassName}>{triggerContent}</SheetTrigger>
          <SheetContent side="bottom" showCloseButton={false} className="max-h-[85vh] rounded-t-2xl">
            <SheetHeader className="pb-2">
              <SheetTitle className="text-base">Filter</SheetTitle>
              <SheetDescription>Hasil diperbarui langsung saat filter dipilih.</SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto px-6 pb-2">
              <PanelBody groups={groups} toggles={toggles} />
            </div>
            <SheetFooter>
              <SheetClose className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Lihat hasil
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
