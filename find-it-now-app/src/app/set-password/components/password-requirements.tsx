import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    id: "length",
    label: "At least 8 characters long",
    test: (password) => password.length >= 8,
  },
  {
    id: "lowercase",
    label: "Contains at least one lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Contains at least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Contains at least one number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Contains at least one special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const PasswordRequirements = ({
  password,
}: PasswordRequirementsProps) => {
  if (password.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        Password Requirements:
      </h4>
      <ul className="space-y-1">
        {requirements.map((requirement) => {
          const isMet = requirement.test(password);
          return (
            <li
              key={requirement.id}
              className="flex items-center gap-2 text-sm"
            >
              {isMet ? (
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
              <span className={cn(isMet ? "text-green-700" : "text-red-700")}>
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
