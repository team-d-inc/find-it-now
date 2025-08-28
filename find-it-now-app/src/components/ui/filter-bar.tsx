import { cn } from "@/lib/utils";
import FilterItem from "./filter-item";
import { ListFilter } from "lucide-react";

interface FilterBarProps {
  filters: {
    key: string;
    title: string;
    list: { id: string; name: string }[];
  }[];
  className?: string;
}

export function FilterBar({ filters, className }: FilterBarProps) {
  if (!filters || !Array.isArray(filters)) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
        <ListFilter size={16} />
        Filter
      </label>
      <div className="flex gap-2">
        {filters.map((filter) => (
          <FilterItem
            key={filter.key}
            title={filter.title}
            list={filter.list}
            filterKey={filter.key}
          />
        ))}
      </div>
    </div>
  );
}
