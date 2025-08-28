"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Status = { value: string; label: string };

interface StatusFilterProps {
  statuses: Status[];
  value?: string;
  label: string;
  onValueChange: (value: string | undefined) => void;
}

export function StatusFilter({
  statuses,
  value,
  label,
  onValueChange,
}: StatusFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedStatus = statuses.find((status) => status.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-semibold text-slate-800 bg-gray-50 hover:bg-gray-200"
        >
          {selectedStatus ? (
            <div className="flex items-center gap-2">
              {selectedStatus.label}
            </div>
          ) : (
            `All ${label}`
          )}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <div className="py-1">
          <button
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => {
              onValueChange(undefined);
              setOpen(false);
            }}
          >
            {`All ${label}`}
          </button>
          {statuses.map((status) => (
            <button
              key={status.value}
              className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => {
                onValueChange(status.value);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">{status.label}</div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
