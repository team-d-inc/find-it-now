import React from "react";
import { Button } from "@/components/ui/button";

const Unauthorized = ({ onAction }: { onAction?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Unauthorized
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        You don’t have permission to access this page.
      </p>
      <Button onClick={onAction} variant={"secondary"}>
        Go Back
      </Button>
    </div>
  );
};

export default Unauthorized;
