"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
  paramName?: string;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  label: string;
}

export function SearchInput({
  paramName = "search",
  placeholder = "Search...",
  className = "",
  debounceMs = 300,
  label = "items",
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(paramName) || ""
  );

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(paramName, term);
    } else {
      params.delete(paramName);
    }
    params.delete("page"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  }, debounceMs);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <>
      <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
        <Search size={16} />
        Search {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={cn(
          "block w-full px-5 py-4 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400",
          className
        )}
      />
    </>
  );
}
