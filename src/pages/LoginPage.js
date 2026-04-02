import React, { useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 12px 30px rgba(15,23,42,0.10)",
          border: "1px solid rgba(229,231,235,0.8)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="/logo.png"
            alt="Lafx Index"
            style={{
              width: 52,
              height: 52,
              objectFit: "contain",
              marginBottom: 12,
            }}
          />
          <h2 style={{ margin: 0, color: "#111827" }}>Admin Login</h2>
          <p style={{ color: "#6b7280", marginTop: 8 }}>
            Lafx Index Trade Journal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 
}}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            style={fieldStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={fieldStyle}
          />

          <button
            type="submit"
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

export default LoginPage;
