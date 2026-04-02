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
                Public trader directory
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {user ? (
              <Link to="/dashboard" style={primaryButtonStyle}>
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" style={primaryButtonStyle}>
                Admin Login
              </Link>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.85)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Meet the Traders
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 760,
              lineHeight: 1.6,
            }}
          >
            Explore public trader dashboards, review trade history, and 
follow
            individual performance across the Lafx Index platform.
          </div>
        </div>

        {loading ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              color: "#6b7280",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            Loading traders...
          </div>
        ) : traders.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              color: "#6b7280",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            No traders found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 
1fr))",
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
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: 22,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                    border: "1px solid rgba(229,231,235,0.85)",
                    transition: "all 0.2s ease",
                    transform:
                      index % 2 === 0 ? "translateY(0px)" : 
"translateY(8px)",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(15, 23, 42, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      index % 2 === 0 ? "translateY(0px)" : 
"translateY(8px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(15, 23, 42, 0.06)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", 
gap: 14 }}>
                    <img
                      src={trader.avatar_url || "/logo.png"}
                      alt={trader.display_name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 999,
                        border: "2px solid #f3f4f6",
                        background: "#fff",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#111827",
                          lineHeight: 1.2,
                        }}
                      >
                        {trader.display_name}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          marginTop: 4,
                        }}
                      >
                        @{trader.public_slug}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    {trader.twitter_url && (
                      <span style={tagStyle}>Twitter</span>
                    )}
                    {trader.instagram_url && (
                      <span style={tagStyle}>Instagram</span>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
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

const primaryButtonStyle = {
  textDecoration: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 800,
  fontSize: 14,
};

const tagStyle = {
  display: "inline-block",
  background: "#f3f4f6",
  color: "#111827",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

export default TraderDirectoryPage;import React, { useEffect, useState } 
from "react";
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
                Public trader directory
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {user ? (
              <Link to="/dashboard" style={primaryButtonStyle}>
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" style={primaryButtonStyle}>
                Admin Login
              </Link>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.85)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Meet the Traders
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 760,
              lineHeight: 1.6,
            }}
          >
            Explore public trader dashboards, review trade history, and 
follow
            individual performance across the Lafx Index platform.
          </div>
        </div>

        {loading ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              color: "#6b7280",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            Loading traders...
          </div>
        ) : traders.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              color: "#6b7280",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            No traders found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 
1fr))",
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
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: 22,
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                    border: "1px solid rgba(229,231,235,0.85)",
                    transition: "all 0.2s ease",
                    transform:
                      index % 2 === 0 ? "translateY(0px)" : 
"translateY(8px)",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(15, 23, 42, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      index % 2 === 0 ? "translateY(0px)" : 
"translateY(8px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(15, 23, 42, 0.06)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", 
gap: 14 }}>
                    <img
                      src={trader.avatar_url || "/logo.png"}
                      alt={trader.display_name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 999,
                        border: "2px solid #f3f4f6",
                        background: "#fff",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#111827",
                          lineHeight: 1.2,
                        }}
                      >
                        {trader.display_name}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          marginTop: 4,
                        }}
                      >
                        @{trader.public_slug}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    {trader.twitter_url && (
                      <span style={tagStyle}>Twitter</span>
                    )}
                    {trader.instagram_url && (
                      <span style={tagStyle}>Instagram</span>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
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

const primaryButtonStyle = {
  textDecoration: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 800,
  fontSize: 14,
};

const tagStyle = {
  display: "inline-block",
  background: "#f3f4f6",
  color: "#111827",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

export default TraderDirectoryPage;
