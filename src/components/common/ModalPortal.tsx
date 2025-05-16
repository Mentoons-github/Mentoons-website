import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
  isOpen: boolean;
  zIndex?: number;
}

/**
 * A utility component that renders its children at the root level of the DOM
 * to ensure proper stacking context and prevent z-index issues
 */
const ModalPortal: React.FC<ModalPortalProps> = ({
  children,
  isOpen,
  zIndex = 2147483647, // max safe integer for z-index
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        isolation: "isolate",
        contain: "layout paint size",
        transformStyle: "preserve-3d",
      }}
      className="pointer-events-auto"
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalPortal;
