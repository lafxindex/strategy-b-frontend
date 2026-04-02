import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Prevent flicker while auth loads
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return children;
}

export default ProtectedRoute;
