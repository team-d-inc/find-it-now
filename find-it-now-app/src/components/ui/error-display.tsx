import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "compact";
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "An error occurred",
  className = "",
  showIcon = true,
  variant = "default"
}: ErrorDisplayProps) {
  if (variant === "compact") {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {showIcon && (
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-red-800 font-medium">{title}</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen bg-gray-50 ${className}`}>
      <div className="w-full max-w-none px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            {showIcon && (
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold text-lg mb-2">{title}</h3>
              <p className="text-red-700 mb-4">{error}</p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 