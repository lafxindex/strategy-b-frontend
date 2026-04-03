import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ onOpenTradeModal, isAdmin = true }) {
  const { logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img
          src="/logo.png"
          alt="Lafx Index"
          style={{
            width: 44,
            height: 44,
            objectFit: "contain",
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            Lafx Index Trade Journal
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#6b7280",
              marginTop: 4,
            }}
          >
            Private dashboard and performance journal
          </div>
        </div>
      </div>

      {isAdmin && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/settings" style={secondaryLinkStyle}>
            Settings
          </Link>

          <button
            onClick={onOpenTradeModal}
            style={{
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 18px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(17,24,39,0.15)",
            }}
          >
            + New Trade
          </button>

          <button
            onClick={logout}
            style={{
              background: "#fff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const secondaryLinkStyle = {
  textDecoration: "none",
  background: "#fff",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 700,
  fontSize: 14,
};

export default Header;
