import React from "react";
import "./loading-overlay.css";

type LoadingOverlayProps = {
  message?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading…" }) => (
  <div className="loading-overlay" role="status" aria-live="polite">
    <div className="loading-overlay__spinner" aria-hidden="true" />
    <p className="loading-overlay__message">{message}</p>
  </div>
);

export default LoadingOverlay;
