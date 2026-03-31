import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";
import NewTradeModal from "../components/NewTradeModal";

const statusStyles = {
  Planned: "#6b7280",
  Active: "#2563eb",
  Partial: "#d97706",
  Closed: "#16a34a",
  Invalidated: "#dc2626",
};

function DashboardPage() {
  const [trades, setTrades] = useState([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

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
    { label: "Closed Trades", value: metrics.closedTrades, tone: "#16a34a" 
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
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16,
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
                <div style={{ fontSize: 22, fontWeight: 800, color: 
"#111827" }}>
                  Trade Feed
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 
}}>
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                {filteredTrades.map((trade, index) => {
                  const statusColor = statusStyles[trade.status] || 
"#6b7280";
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
              <div style={{ fontSize: 18, fontWeight: 800, color: 
"#111827" }}>
                Reports
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow label="Today" value={`${metrics.todayR >= 0 ? 
"+" : ""}${metrics.todayR.toFixed(1)}R`} />
                <ReportRow label="This Week" value={`${metrics.weekR >= 0 
? "+" : ""}${metrics.weekR.toFixed(1)}R`} />
                <ReportRow label="This Month" value={`${metrics.monthR >= 
0 ? "+" : ""}${metrics.monthR.toFixed(1)}R`} />
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
              <div style={{ fontSize: 18, fontWeight: 800, color: 
"#111827" }}>
                Breakdown
              </div>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                <ReportRow label="Wins" value={metrics.wins} />
                <ReportRow label="Losses" value={metrics.losses} />
                <ReportRow label="Break Even" value={metrics.breakEven} />
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
              <div style={{ fontSize: 18, fontWeight: 800, color: 
"#111827" }}>
                Filters
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                {["All", "Planned", "Active", "Partial", "Closed", 
"Invalidated"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      style={{
                        textAlign: "left",
                        padding: "11px 12px",
                        borderRadius: 12,
                        border: filter === item ? "1px solid #111827" : 
"1px solid #e5e7eb",
                        background: filter === item ? "#111827" : "#fff",
                        color: filter === item ? "#fff" : "#111827",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </button>
                  )
                )}
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

function ReportRow({ label, value }) {
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
      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" 
}}>{value}</div>
    </div>
  );
}

export default DashboardPage;
