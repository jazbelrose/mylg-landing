import React from "react";
import { createPortal } from "react-dom";

export const RootPortal: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (typeof document === "undefined") return <>{children}</>;
  return createPortal(children, document.body);
};

export default RootPortal;
