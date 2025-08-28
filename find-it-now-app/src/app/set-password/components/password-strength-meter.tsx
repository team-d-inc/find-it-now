import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

type PasswordStrength = "weak" | "medium" | "strong";

const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length === 0) return "weak";

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
};

const getStrengthColor = (strength: PasswordStrength) => {
  switch (strength) {
    case "weak":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "strong":
      return "bg-green-500";
  }
};

const getStrengthText = (strength: PasswordStrength) => {
  switch (strength) {
    case "weak":
      return "Weak";
    case "medium":
      return "Medium";
    case "strong":
      return "Strong";
  }
};

const getStrengthSegments = (strength: PasswordStrength) => {
  switch (strength) {
    case "weak":
      return [true, false, false];
    case "medium":
      return [true, true, false];
    case "strong":
      return [true, true, true];
  }
};

export const PasswordStrengthMeter = ({
  password,
}: PasswordStrengthMeterProps) => {
  const strength = getPasswordStrength(password);

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Password strength:</span>
        <span
          className={cn(
            "font-medium",
            strength === "weak" && "text-red-600",
            strength === "medium" && "text-yellow-600",
            strength === "strong" && "text-green-600"
          )}
        >
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex gap-2 w-full">
        {[0, 1, 2].map((index) => {
          const segments = getStrengthSegments(strength);
          const isActive = segments[index];
          return (
            <div
              key={index}
              className={cn(
                "flex-1 h-2 rounded transition-all duration-300",
                isActive ? getStrengthColor(strength) : "bg-gray-200"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
