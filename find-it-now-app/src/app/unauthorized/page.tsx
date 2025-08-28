"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBack } from "@/hooks/useBack";

export default function Unauthorized() {
  const back = useBack();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Unauthorized
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        You don&apos;t have permission to access this page.
      </p>
      <Button onClick={back} variant={"secondary"}>
        Go Back
      </Button>
    </div>
  );
}
