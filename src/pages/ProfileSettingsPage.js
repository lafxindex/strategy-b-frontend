import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function ProfileSettingsPage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    display_name: "",
    public_slug: "",
    avatar_url: "",
    twitter_url: "",
    instagram_url: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        display_name: user.display_name || "",
        public_slug: user.public_slug || "",
        avatar_url: user.avatar_url || "",
        twitter_url: user.twitter_url || "",
        instagram_url: user.instagram_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await API.patch("/me/profile", form);
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
                Profile Settings
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                Manage your public trader profile
              </div>
            </div>
          </div>

          <Link
            to="/dashboard"
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
            background: "#ffffff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.8)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Display Name</label>
              <input
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
                placeholder="Display Name"
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Public Slug</label>
              <input
                name="public_slug"
                value={form.public_slug}
                onChange={handleChange}
                placeholder="public-slug"
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Avatar URL</label>
              <input
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                placeholder="https://..."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Twitter URL</label>
              <input
                name="twitter_url"
                value={form.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={labelStyle}>Instagram URL</label>
              <input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                style={fieldStyle}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 800,
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(229,231,235,0.8)",
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 14 }}>
            Live Preview
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <img
              src={form.avatar_url || "/logo.png"}
              alt={form.display_name || "Profile"}
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: 999,
                border: "2px solid #f3f4f6",
                background: "#fff",
              }}
            />

            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
                {form.display_name || "Your Name"}
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                @{form.public_slug || "your-slug"}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                {form.twitter_url && <span style={tagStyle}>Twitter</span>}
                {form.instagram_url && <span style={tagStyle}>Instagram</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

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

const tagStyle = {
  display: "inline-block",
  background: "#f3f4f6",
  color: "#111827",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

export default ProfileSettingsPage;
