import React, { useEffect, useState } from "react";
import API from "./api";

function App() {
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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Strategy B Journal</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <input
            name="instrument"
            placeholder="Instrument (EURUSD / XAUUSD)"
            value={form.instrument}
            onChange={handleChange}
          />
          <input
            name="direction"
            placeholder="Direction (Long / Short)"
            value={form.direction}
            onChange={handleChange}
          />
          <input
            name="setup"
            placeholder="Setup"
            value={form.setup}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit">Add Trade</button>
        </div>
      </form>

      <h2>Trades</h2>

      {trades.length === 0 ? (
        <p>No trades yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {trades.map((trade) => (
            <div
              key={trade.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                background: "#fff",
              }}
            >
              <div><strong>{trade.instrument}</strong> — 
{trade.direction}</div>
              <div>Status: {trade.status}</div>
              <div>Setup: {trade.setup || "-"}</div>
              <div>Notes: {trade.notes || "-"}</div>
              <div>Created: {new 
Date(trade.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
