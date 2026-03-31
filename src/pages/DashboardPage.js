import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    instrument: "",
    direction: "",
    setup: "",
    notes: "",
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      await API.post("/trades", data);
      setForm({
        instrument: "",
        direction: "",
        setup: "",
        notes: "",
      });
      fetchTrades();
    } catch (err) {
      console.error("Failed to create trade:", err);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Active":
        return "#2563eb";
      case "Closed":
        return "#16a34a";
      case "Invalidated":
        return "#dc2626";
      case "Partial":
        return "#d97706";
      default:
        return "#6b7280";
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "Arial, 
sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Strategy B 
Journal</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: 30,
          display: "grid",
          gap: 12
        }}
      >
        <h2 style={{ margin: 0 }}>New Trade</h2>
        <input name="instrument" placeholder="Instrument (EURUSD / 
XAUUSD)" value={form.instrument} onChange={handleChange} />
        <input name="direction" placeholder="Direction (Long / Short)" 
value={form.direction} onChange={handleChange} />
        <input name="setup" placeholder="Setup" value={form.setup} 
onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" value={form.notes} 
onChange={handleChange} rows="4" />
        <button type="submit" style={{ padding: "12px 16px", background: 
"#111827", color: "#fff", border: "none", borderRadius: 8 }}>
          Add Trade
        </button>
      </form>

      <h2>Trades</h2>

      <div style={{ display: "grid", gap: 16 }}>
        {trades.map((trade) => (
          <Link
            key={trade.id}
            to={`/trades/${trade.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#fff",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ display: "flex", justifyContent: 
"space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {trade.instrument} — {trade.direction}
              </div>
              <span
                style={{
                  background: badgeColor(trade.status),
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                {trade.status}
              </span>
            </div>
            <div style={{ color: "#374151", marginBottom: 6 }}>Setup: 
{trade.setup || "-"}</div>
            <div style={{ color: "#6b7280" }}>{trade.notes || "-"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
