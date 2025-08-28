"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type LabeledValueProps = {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
};

export function LabeledValue({ label, value, className, valueClassName }: LabeledValueProps) {
  return (
    <div className={cn(className)}>
      <label className="text-xs text-gray-900 font-semibold uppercase tracking-wider text-primary">{label}</label>
      <p className={cn("mt-1 text-gray-700 whitespace-pre-line break-words", valueClassName)}>{value}</p>
    </div>
  );
}
