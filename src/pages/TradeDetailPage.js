import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function TradeDetailPage() {
  const { id } = useParams();
  const [trade, setTrade] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    comment: "",
    status: ""
  });
  const [closeForm, setCloseForm] = useState({
    result: "",
    r_multiple: ""
  });

  const fetchTrade = async () => {
    try {
      const res = await API.get(`/trades/${id}`);
      setTrade(res.data.trade);
      setUpdates(res.data.updates || []);
    } catch (err) {
      console.error("Failed to fetch trade:", err);
    }
  };

  useEffect(() => {
    fetchTrade();
  }, [id]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("comment", updateForm.comment);
      data.append("status", updateForm.status);
      await API.post(`/trades/${id}/updates`, data);
      setUpdateForm({ comment: "", status: "" });
      fetchTrade();
    } catch (err) {
      console.error("Failed to add update:", err);
    }
  };

  const handleCloseTrade = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/trades/${id}/close`, closeForm);
      setCloseForm({ result: "", r_multiple: "" });
      fetchTrade();
    } catch (err) {
      console.error("Failed to close trade:", err);
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

  if (!trade) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <Link to="/" style={{ textDecoration: "none", color: "#2563eb" }}>← 
Back to Dashboard</Link>

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, 
boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", 
alignItems: "center" }}>
          <h1 style={{ margin: 0 }}>{trade.instrument} — 
{trade.direction}</h1>
          <span
            style={{
              background: badgeColor(trade.status),
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {trade.status}
          </span>
        </div>

        <div style={{ marginTop: 16, color: "#374151" }}>
          <div><strong>Setup:</strong> {trade.setup || "-"}</div>
          <div><strong>Notes:</strong> {trade.notes || "-"}</div>
          <div><strong>Result:</strong> {trade.result || "-"}</div>
          <div><strong>R Multiple:</strong> {trade.r_multiple ?? 
"-"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", 
gap: 20, marginTop: 24 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, 
boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ marginTop: 0 }}>Timeline</h2>

          {updates.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No updates yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {updates.map((update) => (
                <div
                  key={update.id}
                  style={{
                    borderLeft: "4px solid #111827",
                    paddingLeft: 16,
                    paddingTop: 8,
                    paddingBottom: 8
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{update.status || 
"Update"}</div>
                  <div style={{ color: "#374151", marginTop: 6 
}}>{update.comment || "-"}</div>
                  <div style={{ color: "#9ca3af", marginTop: 6, fontSize: 
13 }}>
                    {new Date(update.created_at).toLocaleString()}
                  </div>
                  {update.image && (
                    <img
                      
src={`https://api.thelafxindex.co.uk/uploads/${update.image}`}
                      alt="update"
                      style={{ marginTop: 12, maxWidth: "100%", 
borderRadius: 10 }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <form
            onSubmit={handleUpdateSubmit}
            style={{ background: "#fff", padding: 20, borderRadius: 12, 
boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "grid", gap: 12 }}
          >
            <h3 style={{ margin: 0 }}>Add Update</h3>
            <select
              value={updateForm.status}
              onChange={(e) => setUpdateForm({ ...updateForm, status: 
e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Partial">Partial</option>
              <option value="Closed">Closed</option>
              <option value="Invalidated">Invalidated</option>
            </select>
            <textarea
              rows="4"
              placeholder="Update comment"
              value={updateForm.comment}
              onChange={(e) => setUpdateForm({ ...updateForm, comment: 
e.target.value })}
            />
            <button type="submit" style={{ padding: "12px 16px", 
background: "#111827", color: "#fff", border: "none", borderRadius: 8 }}>
              Post Update
            </button>
          </form>

          <form
            onSubmit={handleCloseTrade}
            style={{ background: "#fff", padding: 20, borderRadius: 12, 
boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "grid", gap: 12 }}
          >
            <h3 style={{ margin: 0 }}>Close Trade</h3>
            <select
              value={closeForm.result}
              onChange={(e) => setCloseForm({ ...closeForm, result: 
e.target.value })}
            >
              <option value="">Select Result</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Break Even">Break Even</option>
            </select>
            <input
              type="number"
              step="0.1"
              placeholder="R Multiple"
              value={closeForm.r_multiple}
              onChange={(e) => setCloseForm({ ...closeForm, r_multiple: 
e.target.value })}
            />
            <button type="submit" style={{ padding: "12px 16px", 
background: "#16a34a", color: "#fff", border: "none", borderRadius: 8 }}>
              Close Trade
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TradeDetailPage;
