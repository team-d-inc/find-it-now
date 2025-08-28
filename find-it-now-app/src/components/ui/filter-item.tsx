"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface FilterItemProps {
  title: string;
  list: { id: string; name: string }[];
  filterKey: string;
}

export default function FilterItem({ title, list, filterKey }: FilterItemProps) {
  const {
    getSelectedValues,
    getSelectedCount,
    toggleFilterValue,
    clearFilter,
  } = useFilters();

  // 安全なチェックを追加
  if (!list || !Array.isArray(list)) {
    return null;
  }

  const selectedValues = getSelectedValues(filterKey);
  const selectedCount = getSelectedCount(filterKey);
  const hasSelectedItems = selectedCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("bg-gray-100 border-none p-6 shadow-none min-w-[140px]", hasSelectedItems && "border-accent")}
        >
          {title} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white">
        <DropdownMenuGroup>
          {list.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedValues.has(item.name)}
              onCheckedChange={(checked) =>
                toggleFilterValue(filterKey, item.name, checked)
              }
            >
              {item.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => clearFilter(filterKey)}
          disabled={!hasSelectedItems}
        >
          <RefreshCcw /> Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 