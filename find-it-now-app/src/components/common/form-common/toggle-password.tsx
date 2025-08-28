"use client";

import { Eye, EyeOff } from "lucide-react";

interface TogglePasswordProps {
  show: boolean;
  onToggle: () => void;
  className?: string;
}

export const TogglePassword = ({show, onToggle, className}: TogglePasswordProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded-md ${className}`}
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    >
      {show ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </div>
  )
}