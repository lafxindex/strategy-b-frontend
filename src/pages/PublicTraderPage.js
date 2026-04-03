import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api";

const getTradeColor = (trade) => {
  if (trade.result === "Win") return "#16a34a";
  if (trade.result === "Loss") return "#dc2626";
  if (trade.result === "Break Even") return "#eab308";

  if (trade.status === "Invalidated") return "#dc2626";
  if (trade.status === "Discarded") return "#9ca3af";
  if (trade.status === "Active") return "#2563eb";
  if (trade.status === "Partial") return "#d97706";

  return "#6b7280";
};

function shouldShowRR(trade) {
  return (
    trade.status === "Closed" &&
    (trade.result === "Win" || trade.result === "Loss") &&
    trade.r_multiple !== null &&
    trade.r_multiple !== undefined &&
    trade.r_multiple !== ""
  );
}

function PublicTraderPage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTraderPage = async () => {
      try {
        const res = await API.get(`/public/${slug}`);
        setProfile(res.data.user);
        setTrades(res.data.trades || []);
      } catch (err) {
        console.error("Failed to fetch trader page:", err);
      }
    };

    fetchTraderPage();
  }, [slug]);

  const metrics = useMemo(() => {
    const totalTrades = trades.length;
    const activeTrades = trades.filter((t) => t.status === "Active").length;

    const wins = trades.filter((t) => t.result === "Win").length;
    const losses = trades.filter((t) => t.result === "Loss").length;
    const breakEven = trades.filter((t) => t.result === "Break Even").length;

    const wonTrades = wins;
    const lostTrades = losses;

    const completed = wins + losses + breakEven;
    const winRate = completed > 0 ? ((wins / completed) * 100).toFixed(0) : "0";

    const netR = trades.reduce((sum, trade) => {
      const value = parseFloat(trade.r_multiple);
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    const now = new Date();

    const sameDay = (dateA, dateB) =>
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const todayR = trades.reduce((sum, trade) => {
      const created = new Date(trade.created_at);
      const value = parseFloat(trade.r_multiple);
      if (sameDay(created, now) && !Number.isNaN(value)) return sum + value;
      return sum;
    }, 0);

    const weekR = trades.reduce((sum, trade) => {
      const created = new Date(trade.created_at);
      const value = parseFloat(trade.r_multiple);
      if (created >= startOfWeek && !Number.isNaN(value)) return sum + value;
      return sum;
    }, 0);

    const monthR = trades.reduce((sum, trade) => {
      const created = new Date(trade.created_at);
      const value = parseFloat(trade.r_multiple);
      if (
        created.getFullYear() === now.getFullYear() &&
        created.getMonth() === now.getMonth() &&
        !Number.isNaN(value)
      ) {
        return sum + value;
      }
      return sum;
    }, 0);

    return {
      totalTrades,
      activeTrades,
      wins,
      losses,
      breakEven,
      wonTrades,
      lostTrades,
      winRate,
      netR,
      todayR,
      weekR,
      monthR,
    };
  }, [trades]);

  const filteredTrades = useMemo(() => {
    if (filter === "All") return trades;
    if (filter === "Planned") return trades.filter((trade) => trade.status === "Planned");
    if (filter === "Active") return trades.filter((trade) => trade.status === "Active");
    if (filter === "Won") return trades.filter((trade) => trade.result === "Win");
    if (filter === "Lost") return trades.filter((trade) => trade.result === "Loss");
    return trades;
  }, [trades, filter]);

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", color: "#6b7280" }}>
          Loading trader page...
        </div>
      </div>
    );
  }

  const summaryCards = [
    { label: "Total Trades", value: metrics.totalTrades, tone: "#111827" },
    { label: "Win Rate", value: `${metrics.winRate}%`, tone: "#111827" },
    {
      label: "Net R",
      value: `${metrics.netR >= 0 ? "+" : ""}${metrics.netR.toFixed(1)}R`,
      tone: metrics.netR >= 0 ? "#16a34a" : "#dc2626",
    },
    { label: "Active Trades", value: metrics.activeTrades, tone: "#2563eb" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
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
                Public trader profile
              </div>
            </div>
          </div>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#2563eb",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ← Back Home
          </Link>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.8)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={profile.avatar_url || "/logo.png"}
              alt={profile.display_name}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 999,
                background: "#fff",
                border: "2px solid #f3f4f6",
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
                {profile.display_name}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 6,
                }}
              >
                @{profile.public_slug}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {profile.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noreferrer"
                style={socialButtonStyle}
              >
                Twitter
              </a>
            )}

            {profile.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noreferrer"
                style={socialButtonStyle}
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {summaryCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: "20px 18px",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: card.tone,
                  lineHeight: 1.1,
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>
                {card.label}
              </div>
            </div>
          ))}

          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: "20px 18px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              border: "1px solid rgba(229,231,235,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#16a34a",
                  lineHeight: 1.1,
                }}
              >
                {metrics.wonTrades}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>
                Won Trades
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
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#dc2626",
                  lineHeight: 1.1,
                }}
              >
                {metrics.lostTrades}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>
                Lost Trades
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(280px, 0.75fr)",
            gap: 22,
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Trade Feed
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                Public trade history for {profile.display_name}
              </div>
            </div>

            {filteredTrades.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: 28,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  color: "#6b7280",
                }}
              >
                No trades found.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                {filteredTrades.map((trade, index) => {
                  const statusColor = getTradeColor(trade);

                  return (
                    <Link
                      key={trade.id}
                      to={`/trader/${slug}/trades/${trade.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          borderLeft: `5px solid ${statusColor}`,
                          borderRadius: 16,
                          padding: 18,
                          background: "#ffffff",
                          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                          transition: "all 0.2s ease",
                          transform:
                            index % 2 === 0 ? "translateY(0px)" : "translateY(10px)",
                          cursor: "pointer",
                          minHeight: 130,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 16px 32px rgba(15, 23, 42, 0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            index % 2 === 0 ? "translateY(0px)" : "translateY(10px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 18px rgba(15, 23, 42, 0.08)";
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 17,
                                color: "#111827",
                                lineHeight: 1.2,
                              }}
                            >
                              {trade.instrument} — {trade.direction}
                            </div>

                            <span
                              style={{
                                background: statusColor,
                                color: "#fff",
                                padding: "5px 9px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {trade.status}
                            </span>
                          </div>

                          {shouldShowRR(trade) && (
                            <div
                              style={{
                                marginTop: 12,
                                fontSize: 14,
                                fontWeight: 800,
                                color:
                                  trade.result === "Win" ? "#16a34a" : "#dc2626",
                              }}
                            >
                              {parseFloat(trade.r_multiple) > 0 ? "+" : ""}
                              {trade.r_multiple}R
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            color: "#6b7280",
                            marginTop: 20,
                          }}
                        >
                          Created:{" "}
                          {new Date(trade.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Reports
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow
                  label="Today"
                  value={`${metrics.todayR >= 0 ? "+" : ""}${metrics.todayR.toFixed(1)}R`}
                />
                <ReportRow
                  label="This Week"
                  value={`${metrics.weekR >= 0 ? "+" : ""}${metrics.weekR.toFixed(1)}R`}
                />
                <ReportRow
                  label="This Month"
                  value={`${metrics.monthR >= 0 ? "+" : ""}${metrics.monthR.toFixed(1)}R`}
                />
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Breakdown
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow label="Wins" value={metrics.wins} valueColor="#16a34a" />
                <ReportRow label="Losses" value={metrics.losses} valueColor="#dc2626" />
                <ReportRow
                  label="Break Even"
                  value={metrics.breakEven}
                  valueColor="#eab308"
                />
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Filters
              </div>

              <div style={{ marginTop: 18 }}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="All">All</option>
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ label, value, valueColor = "#111827" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: valueColor }}>{value}</div>
    </div>
  );
}

const socialButtonStyle = {
  textDecoration: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 700,
  fontSize: 14,
};

export default PublicTraderPage;
