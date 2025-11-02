import React from "react";

interface NameTooltipProps {
  name: string;
  children: React.ReactNode;
}

export const NameTooltip: React.FC<NameTooltipProps> = ({ name, children }) => {
  return (
    <div className="group relative inline-block w-full">
      {children}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100 md:group-hover:opacity-100 z-10">
        {name}
      </div>
    </div>
  );
};
