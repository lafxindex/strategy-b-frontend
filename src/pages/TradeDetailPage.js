import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const getTradeColor = (trade) => {
  if (trade.result === "Win") return "#16a34a"; // green
  if (trade.result === "Loss") return "#dc2626"; // red
  if (trade.result === "Break Even") return "#eab308"; // yellow

  if (trade.status === "Invalidated") return "#dc2626";
  if (trade.status === "Discarded") return "#9ca3af";
  if (trade.status === "Active") return "#2563eb";
  if (trade.status === "Partial") return "#d97706";

  return "#6b7280";
};

function TradeDetailPage() {
  const { id } = useParams();
  const [trade, setTrade] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    comment: "",
    status: "",
    chart_url: "",
  });
  const [closeForm, setCloseForm] = useState({
    result: "",
    r_multiple: "",
    after_chart_url: "",
  });

  const fetchTrade = useCallback(async () => {
    try {
      const res = await API.get(`/trades/${id}`);
      setTrade(res.data.trade);
      setUpdates(res.data.updates || []);
    } catch (err) {
      console.error("Failed to fetch trade:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchTrade();
  }, [fetchTrade]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/trades/${id}/updates`, {
        comment: updateForm.comment,
        status: updateForm.status,
        chart_url: updateForm.chart_url,
      });

      setUpdateForm({
        comment: "",
        status: "",
        chart_url: "",
      });

      fetchTrade();
    } catch (err) {
      console.error("Failed to add update:", err);
      alert("Failed to add update.");
    }
  };

  const handleCloseTrade = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/trades/${id}/close`, {
        result: closeForm.result,
        r_multiple: closeForm.r_multiple,
        after_chart_url: closeForm.after_chart_url,
      });

      setCloseForm({
        result: "",
        r_multiple: "",
        after_chart_url: "",
      });

      fetchTrade();
    } catch (err) {
      console.error("Failed to close trade:", err);
      alert("Failed to close trade.");
    }
  };

  if (!trade) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ color: "#6b7280" }}>Loading trade...</div>
        </div>
      </div>
    );
  }

  const tradeColor = getTradeColor(trade);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src="/logo.png"
              alt="Lafx Index"
              style={{
                width: 42,
                height: 42,
                objectFit: "contain",
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 26,
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
                Trade detail and timeline
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
            ← Back to Dashboard
          </Link>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 18,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.8)",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  color: "#111827",
                }}
              >
                {trade.instrument} — {trade.direction}
              </h1>
              <div
                style={{
                  color: "#6b7280",
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                Created:{" "}
                {new Date(trade.created_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <span
              style={{
                background: tradeColor,
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {trade.status}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 22,
            }}
          >
            <InfoCard label="Setup" value={trade.setup || "-"} />
            <InfoCard label="Result" value={trade.result || "-"} />
            <InfoCard
              label="R Multiple"
              value={
                trade.r_multiple !== null && trade.r_multiple !== 
undefined
                  ? trade.r_multiple
                  : "-"
              }
            />
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: "#f9fafb",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              Notes
            </div>
            <div style={{ color: "#111827", lineHeight: 1.6 }}>
              {trade.notes || "-"}
            </div>
          </div>

          {trade.before_chart_url && (
            <ChartCard
              title="Before Chart"
              url={trade.before_chart_url}
              style={{ marginTop: 20 }}
            />
          )}

          {trade.after_chart_url && (
            <ChartCard
              title="Final Chart"
              url={trade.after_chart_url}
              style={{ marginTop: 14 }}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.75fr)",
            gap: 22,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 18,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              border: "1px solid rgba(229,231,235,0.8)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 18, color: "#111827" 
}}>
              Timeline
            </h2>

            {updates.length === 0 ? (
              <div style={{ color: "#6b7280" }}>No updates yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 18 }}>
                {updates.map((update) => {
                  const updateColor = getTradeColor(update);

                  return (
                    <div
                      key={update.id}
                      style={{
                        borderLeft: `4px solid ${updateColor}`,
                        paddingLeft: 16,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ fontWeight: 800, color: "#111827" 
}}>
                          {update.status || "Update"}
                        </div>
                        <div style={{ fontSize: 13, color: "#9ca3af" }}>
                          {new 
Date(update.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#374151",
                          marginTop: 8,
                          lineHeight: 1.6,
                        }}
                      >
                        {update.comment || "-"}
                      </div>

                      {update.chart_url && (
                        <ChartCard
                          title="TradingView Chart"
                          url={update.chart_url}
                          style={{ marginTop: 12 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <form
              onSubmit={handleUpdateSubmit}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 18,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
                display: "grid",
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, color: "#111827" }}>Add Update</h3>

              <select
                value={updateForm.status}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, status: 
e.target.value }))
                }
                style={fieldStyle}
              >
                <option value="">Select Status</option>
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Partial">Partial</option>
                <option value="Closed">Closed</option>
                <option value="Invalidated">Invalidated</option>
                <option value="Discarded">Discarded</option>
              </select>

              <textarea
                rows="4"
                placeholder="Update comment"
                value={updateForm.comment}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, comment: 
e.target.value }))
                }
                style={{ ...fieldStyle, resize: "vertical" }}
              />

              <input
                type="text"
                placeholder="TradingView link (optional)"
                value={updateForm.chart_url}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, chart_url: 
e.target.value }))
                }
                style={fieldStyle}
              />

              <button
                type="submit"
                style={{
                  padding: "12px 16px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Post Update
              </button>
            </form>

            <form
              onSubmit={handleCloseTrade}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 18,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(229,231,235,0.8)",
                display: "grid",
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, color: "#111827" }}>Close Trade</h3>

              <select
                value={closeForm.result}
                onChange={(e) =>
                  setCloseForm((prev) => ({ ...prev, result: 
e.target.value }))
                }
                style={fieldStyle}
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
                onChange={(e) =>
                  setCloseForm((prev) => ({ ...prev, r_multiple: 
e.target.value }))
                }
                style={fieldStyle}
              />

              <input
                type="text"
                placeholder="Final TradingView link (optional)"
                value={closeForm.after_chart_url}
                onChange={(e) =>
                  setCloseForm((prev) => ({
                    ...prev,
                    after_chart_url: e.target.value,
                  }))
                }
                style={fieldStyle}
              />

              <button
                type="submit"
                style={{
                  padding: "12px 16px",
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Close Trade
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: 14,
        padding: 16,
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
        {value}
      </div>
    </div>
  );
}

function getTradingViewImageUrl(url) {
  if (!url) return null;

  const match = url.match(/tradingview\.com\/x\/([A-Za-z0-9]+)\/?/i);
  if (!match) return null;

  const id = match[1];
  const firstChar = id.charAt(0).toLowerCase();

  return `https://s3.tradingview.com/snapshots/${firstChar}/${id}.png`;
}

function ChartCard({ title, url, style = {} }) {
  const imageUrl = getTradingViewImageUrl(url);

  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b7280",
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            borderRadius: 12,
            display: "block",
            marginBottom: 12,
            border: "1px solid #e5e7eb",
          }}
        />
      )}

      <div
        style={{
          fontSize: 14,
          color: "#111827",
          wordBreak: "break-word",
          marginBottom: 12,
        }}
      >
        {url}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          textDecoration: "none",
          background: "#111827",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 14px",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        Open Chart
      </a>
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

export default TradeDetailPage;
