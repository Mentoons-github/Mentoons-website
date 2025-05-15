import React from "react";
import { User as UserIcon } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  description?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  description,
}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center max-w-md">
        <UserIcon size={48} className="mx-auto text-red-400" />
        <p className="mt-4 text-lg font-medium">{message}</p>
        {description && <p className="mt-2 text-gray-500">{description}</p>}
      </div>
    </div>
  );
};

export default ErrorDisplay;
