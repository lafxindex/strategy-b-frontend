import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function TraderDirectoryPage() {
  const [traders, setTraders] = useState([]);
  const [traderStats, setTraderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTraders = useCallback(async () => {
    try {
      const res = await API.get(`/public/traders?t=${Date.now()}`);
      const traderList = res.data || [];
      setTraders(traderList);

      const statsEntries = await Promise.all(
        traderList.map(async (trader) => {
          try {
            const traderRes = await API.get(
              `/public/${trader.public_slug}?t=${Date.now()}`
            );
            const trades = traderRes.data?.trades || [];

            let wins = 0;
            let losses = 0;
            let breakEven = 0;

            trades.forEach((t) => {
              if (t.result === "Win") wins++;
              if (t.result === "Loss") losses++;
              if (t.result === "Break Even") breakEven++;
            });

            const completed = wins + losses + breakEven;
            const winRate =
              completed > 0 ? ((wins / completed) * 100).toFixed(0) : "0";

            const netR = trades.reduce((sum, trade) => {
              const value = parseFloat(trade.r_multiple);
              return sum + (Number.isNaN(value) ? 0 : value);
            }, 0);

            return [
              trader.public_slug,
              {
                netR,
                winRate,
                totalTrades: trades.length,
              },
            ];
          } catch (err) {
            console.error(
              `Failed to fetch stats for ${trader.public_slug}:`,
              err
            );
            return [
              trader.public_slug,
              {
                netR: 0,
                winRate: "0",
                totalTrades: 0,
              },
            ];
          }
        })
      );

      setTraderStats(Object.fromEntries(statsEntries));
    } catch (err) {
      console.error("Failed to fetch traders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraders();

    const interval = setInterval(() => {
      fetchTraders();
    }, 5000);

    const handleFocus = () => {
      fetchTraders();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTraders();
      }
    };

    const handlePageShow = () => {
      fetchTraders();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTraders]);

  const sortedTraders = useMemo(() => {
    return [...traders].sort((a, b) => {
      const aStats = traderStats[a.public_slug];
      const bStats = traderStats[b.public_slug];

      const aNet = aStats?.netR || 0;
      const bNet = bStats?.netR || 0;

      return bNet - aNet;
    });
  }, [traders, traderStats]);

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

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 28,
            marginBottom: 28,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32 }}>Meet the Traders</h1>
          <p style={{ color: "#6b7280", marginTop: 10 }}>
            Explore trader dashboards and performance across the Lafx Index
            platform.
          </p>
        </div>

        {loading ? (
          <div style={cardStyle}>Loading traders...</div>
        ) : sortedTraders.length === 0 ? (
          <div style={cardStyle}>No traders found.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {sortedTraders.map((trader, index) => {
              const stats = traderStats[trader.public_slug] || {
                netR: 0,
                winRate: "0",
                totalTrades: 0,
              };

              const netRTone = stats.netR >= 0 ? "#16a34a" : "#dc2626";

              const rankDisplay =
                index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : null;

              const isTopThree = index < 3;
              const isTopOne = index === 0;

              return (
                <Link
                  key={trader.id}
                  to={`/trader/${trader.public_slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      ...cardStyle,
                      position: "relative",
                      boxShadow: isTopOne
                        ? "0 12px 32px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.4)"
                        : "0 8px 24px rgba(0,0,0,0.06)",
                      transform:
                        index % 2 === 0 ? "translateY(0px)" : "translateY(8px)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = isTopOne
                        ? "0 16px 36px rgba(212,175,55,0.32), 0 0 0 1px rgba(212,175,55,0.48)"
                        : "0 16px 32px rgba(15, 23, 42, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        index % 2 === 0 ? "translateY(0px)" : "translateY(8px)";
                      e.currentTarget.style.boxShadow = isTopOne
                        ? "0 12px 32px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.4)"
                        : "0 8px 24px rgba(0,0,0,0.06)";
                    }}
                  >
                    {isTopThree && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "#111827",
                          color: "#fff",
                          borderRadius: 999,
                          padding: "6px 10px",
                          fontSize: 16,
                          fontWeight: 800,
                          boxShadow: isTopOne
                            ? "0 0 0 2px rgba(212,175,55,0.6), 0 0 18px rgba(212,175,55,0.6)"
                            : "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {rankDisplay}
                      </div>
                    )}

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

                    <div
                      style={{
                        marginTop: 18,
                        padding: "14px 16px",
                        borderRadius: 14,
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Net R</div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 22,
                            fontWeight: 800,
                            color: netRTone,
                            lineHeight: 1.1,
                          }}
                        >
                          {stats.netR >= 0 ? "+" : ""}
                          {stats.netR.toFixed(1)}R
                        </div>
                      </div>

                      <div
                        style={{
                          width: 1,
                          alignSelf: "stretch",
                          background: "#d4af37",
                          opacity: 0.9,
                        }}
                      />

                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={labelStyle}>Win Rate</div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#111827",
                            lineHeight: 1.1,
                          }}
                        >
                          {stats.winRate}%
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      {stats.totalTrades} trade
                      {stats.totalTrades === 1 ? "" : "s"}
                    </div>

                    <div
                      style={{
                        marginTop: 20,
                        color: "#2563eb",
                        fontWeight: 700,
                      }}
                    >
                      View Public Dashboard →
                    </div>
                  </div>
                </Link>
              );
            })}
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
};

const buttonStyle = {
  textDecoration: "none",
  background: "#111827",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 10,
  fontWeight: 700,
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
};

export default TraderDirectoryPage;
