import React from "react";

function Header({ onOpenTradeModal, isAdmin = true }) {
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
            Public journal and performance dashboard
          </div>
        </div>
      </div>

      {isAdmin && (
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
      )}
    </div>
  );
}

export default Header;
