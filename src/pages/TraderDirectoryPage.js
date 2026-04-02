import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function TraderDirectoryPage() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const res = await API.get("/public/traders");
        setTraders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch traders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTraders();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="/logo.png"
              alt="Lafx Index"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Lafx Index Trade Journal
              </div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>
                Public trader directory
              </div>
            </div>
          </div>

          <div>
            {user ? (
              <Link to="/dashboard" style={buttonStyle}>
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" style={buttonStyle}>
                Admin Login
              </Link>
            )}
          </div>
        </div>

        {/* Intro */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 28,
            marginBottom: 28,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32 }}>
            Meet the Traders
          </h1>
          <p style={{ color: "#6b7280", marginTop: 10 }}>
            Explore trader dashboards and performance across the Lafx 
Index platform.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={cardStyle}>Loading traders...</div>
        ) : traders.length === 0 ? (
          <div style={cardStyle}>No traders found.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {traders.map((trader, index) => (
              <Link
                key={trader.id}
                to={`/trader/${trader.public_slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    ...cardStyle,
                    transform:
                      index % 2 === 0 ? "translateY(0px)" : 
"translateY(8px)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      index % 2 === 0
                        ? "translateY(0px)"
                        : "translateY(8px)";
                  }}
                >
                  <div style={{ display: "flex", gap: 14 }}>
                    <img
                      src={trader.avatar_url || "/logo.png"}
                      alt={trader.display_name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 20 }}>
                        {trader.display_name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 14 }}>
                        @{trader.public_slug}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, color: "#2563eb", 
fontWeight: 700 }}>
                    View Public Dashboard →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  padding: 22,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const buttonStyle = {
  textDecoration: "none",
  background: "#111827",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 10,
  fontWeight: 700,
};

export default TraderDirectoryPage;
