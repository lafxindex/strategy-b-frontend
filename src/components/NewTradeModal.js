import React, { useState } from "react";
import API from "../api";

function NewTradeModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    instrument: "",
    direction: "",
    setup: "",
    notes: "",
    before_chart_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.post("/trades", form);
      setForm({
        instrument: "",
        direction: "",
        setup: "",
        notes: "",
        before_chart_url: "",
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create trade:", err);
      alert("Failed to create trade.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#ffffff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" 
}}>
              Add New Trade
            </div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
              Create a new public trade entry
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: 10,
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 
}}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", 
gap: 14 }}>
            <select
              name="instrument"
              value={form.instrument}
              onChange={handleChange}
              required
              style={fieldStyle}
            >
              <option value="">Select Instrument</option>
              <option value="EURUSD">EURUSD</option>
              <option value="XAUUSD">XAUUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="AUDUSD">AUDUSD</option>
            </select>

            <select
              name="direction"
              value={form.direction}
              onChange={handleChange}
              required
              style={fieldStyle}
            >
              <option value="">Select Direction</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>

          <input
            name="setup"
            placeholder="Setup"
            value={form.setup}
            onChange={handleChange}
            style={fieldStyle}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            rows="4"
            style={{ ...fieldStyle, resize: "vertical" }}
          />

          <input
            name="before_chart_url"
            placeholder="TradingView link (optional)"
            value={form.before_chart_url}
            onChange={handleChange}
            style={fieldStyle}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 
12, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f3f4f6",
                color: "#111827",
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                fontWeight: 700,
                cursor: "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Creating..." : "Create Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

export default NewTradeModal;
