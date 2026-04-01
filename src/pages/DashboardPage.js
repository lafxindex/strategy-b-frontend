import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";
import NewTradeModal from "../components/NewTradeModal";

const getTradeColor = (trade) => {
  if (trade.result === "Win") return "#16a34a"; // green
  if (trade.result === "Loss") return "#dc2626"; // red
  if (trade.result === "Break Even") return "#eab308"; // yellow

  if (trade.status === "Invalidated") return "#dc2626"; // red
  if (trade.status === "Discarded") return "#9ca3af"; // gray
  if (trade.status === "Active") return "#2563eb"; // blue
  if (trade.status === "Partial") return "#d97706"; // orange

  return "#6b7280"; // planned default gray
};

function DashboardPage() {
  const [trades, setTrades] = useState([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  // Replace with real auth later
  const isAdmin = true;

  const fetchTrades = async () => {
    try {
      const res = await API.get("/trades");
      setTrades(res.data);
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const metrics = useMemo(() => {
    const totalTrades = trades.length;
    const activeTrades = trades.filter((t) => t.status === 
"Active").length;
    const closedTrades = trades.filter((t) => t.status === 
"Closed").length;

    const wins = trades.filter((t) => t.result === "Win").length;
    const losses = trades.filter((t) => t.result === "Loss").length;
    const breakEven = trades.filter((t) => t.result === "Break Even").length;

    const wonTrades = wins;
    const lostTrades = losses;

    const completed = wins + losses + breakEven;
    const winRate = completed > 0 ? ((wins / completed) * 100).toFixed(0) 
: "0";

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
      if (sameDay(created, now) && !Number.isNaN(value)) return sum + 
value;
      return sum;
    }, 0);

    const weekR = trades.reduce((sum, trade) => {
      const created = new Date(trade.created_at);
      const value = parseFloat(trade.r_multiple);
      if (created >= startOfWeek && !Number.isNaN(value)) return sum + 
value;
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
      closedTrades,
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
    return trades.filter((trade) => trade.status === filter);
  }, [trades, filter]);

  const summaryCards = [
    { label: "Total Trades", value: metrics.totalTrades, tone: "#111827" 
},
    { label: "Win Rate", value: `${metrics.winRate}%`, tone: "#111827" },
    {
      label: "Net R",
      value: `${metrics.netR >= 0 ? "+" : ""}${metrics.netR.toFixed(1)}R`,
      tone: metrics.netR >= 0 ? "#16a34a" : "#dc2626",
    },
    { label: "Active Trades", value: metrics.activeTrades, tone: "#2563eb" 
},
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Header
          onOpenTradeModal={() => setIsTradeModalOpen(true)}
          isAdmin={isAdmin}
        />

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
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
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
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
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
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
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
                  Public trade log and activity
                </div>
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 
1fr))",
                  gap: 16,
                }}
              >
                {filteredTrades.map((trade, index) => {
                  const statusColor = getTradeColor(trade);

                  return (
                    <Link
                      key={trade.id}
                      to={`/trades/${trade.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
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
                            index % 2 === 0 ? "translateY(0px)" : 
"translateY(10px)",
                          cursor: "pointer",
                          minHeight: 115,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 
"translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 16px 32px rgba(15, 23, 42, 0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            index % 2 === 0 ? "translateY(0px)" : 
"translateY(10px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 18px rgba(15, 23, 42, 0.08)";
                        }}
                      >
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

                        <div
                          style={{
                            fontSize: 13,
                            color: "#6b7280",
                            marginTop: 20,
                          }}
                        >
                          Created:{" "}
                          {new 
Date(trade.created_at).toLocaleDateString(undefined, {
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
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Reports
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow
                  label="Today"
                  value={`${metrics.todayR >= 0 ? "+" : 
""}${metrics.todayR.toFixed(1)}R`}
                />
                <ReportRow
                  label="This Week"
                  value={`${metrics.weekR >= 0 ? "+" : 
""}${metrics.weekR.toFixed(1)}R`}
                />
                <ReportRow
                  label="This Month"
                  value={`${metrics.monthR >= 0 ? "+" : 
""}${metrics.monthR.toFixed(1)}R`}
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
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Breakdown
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow label="Wins" value={metrics.wins} 
valueColor="#16a34a" />
                <ReportRow label="Losses" value={metrics.losses} 
valueColor="#dc2626" />
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
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
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
                  <option value="Partial">Partial</option>
                  <option value="Closed">Closed</option>
                  <option value="Invalidated">Invalidated</option>
                  <option value="Discarded">Discarded</option>
                </select>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsTradeModalOpen(true)}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    background: "#111827",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  + Add New Trade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewTradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onCreated={fetchTrades}
      />
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
      <div style={{ fontSize: 16, fontWeight: 800, color: valueColor 
}}>{value}</div>
    </div>
  );
}

export default DashboardPage;
