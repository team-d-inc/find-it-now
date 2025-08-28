import React from 'react';

interface StatusScreenProps {
  statusCode?: string;
  title?: string;
  message?: string;
}

const StatusScreen = ({ title }: StatusScreenProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">{title || 'Unauthorized'}</h1>
      <p className="mb-6 text-center text-gray-600">
        You don’t have permission to access this page.
      </p>
      {/* <Button onClick={onAction} variant={"secondary"}>
        Go Back
      </Button> */}
    </div>
  );
};

export default StatusScreen;
