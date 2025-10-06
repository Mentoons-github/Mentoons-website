import React from "react";
import { HeaderProps } from "@/types/employee";

const SessionHeader: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-8 text-center">
      <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
        <span className="text-5xl">🧠</span> {title}
      </h1>
      <p className="text-lg opacity-90">{description}</p>
    </div>
  );
};

export default SessionHeader;
