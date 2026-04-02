import React, { createContext, useContext, useEffect, useState } from 
"react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to restore session:", err);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.user) {
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
