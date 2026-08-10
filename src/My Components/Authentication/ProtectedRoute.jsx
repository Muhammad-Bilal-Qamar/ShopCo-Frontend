import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import AuthPromptModal from "./AuthPromptModal";

const ProtectedRoute = ({ children, requireRole, message }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isAuthenticated) {
    if (dismissed) return <Navigate to="/login" replace />;
    return (
      <AuthPromptModal
        open
        onClose={() => setDismissed(true)}
        message={message || "You need to log in to continue."}
      />
    );
  }

  if (requireRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;