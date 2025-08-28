"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  value: string;
  label: string;
};

function enumToOptions<T extends object>(enumObj: T): SelectOption[] {
  return Object.entries(enumObj)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key]) => ({
      value: key,
      label: key,
    }));
}

type GroupedSelectGroup =
  | {
      label: string;
      options: SelectOption[];
    }
  | {
      label: string;
      enum: object;
    };

type GroupedSelectProps = {
  groups: GroupedSelectGroup[];
  placeholder?: string;
  selected?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const GroupedSelect: React.FC<GroupedSelectProps> = ({
  groups,
  placeholder = "Select an option",
  selected,
  onChange,
  className,
}) => {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => {
          const options =
            "options" in group ? group.options : enumToOptions(group.enum);
          return (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};
