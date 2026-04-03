import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    username: "",
    display_name: "",
    email: "",
    password: "",
    public_slug: "",
    avatar_url: "",
    twitter_url: "",
    instagram_url: "",
    role: "trader",
  });

  const isSuperAdmin = user?.role === "super_admin";

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await API.post("/admin/users", form);

      setForm({
        username: "",
        display_name: "",
        email: "",
        password: "",
        public_slug: "",
        avatar_url: "",
        twitter_url: "",
        instagram_url: "",
        role: "trader",
      });

      await fetchUsers();
      alert("Trader created successfully");
    } catch (err) {
      console.error("Failed to create user:", err);
      alert(err?.response?.data?.error || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Access Denied</h2>
            <p style={{ color: "#6b7280" }}>
              Only super admin can manage users.
            </p>
            <Link to="/dashboard" style={{ color: "#2563eb", fontWeight: 700 }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                Admin User Management
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                Create and manage trader accounts
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
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: 22,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              border: "1px solid rgba(229,231,235,0.8)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#111827" }}>Create Trader</h2>

            <form onSubmit={handleCreateUser} style={{ display: "grid", gap: 14 }}>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                style={fieldStyle}
              />
              <input
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
                placeholder="Display Name"
                style={fieldStyle}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                style={fieldStyle}
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                style={fieldStyle}
              />
              <input
                name="public_slug"
                value={form.public_slug}
                onChange={handleChange}
                placeholder="Public Slug"
                style={fieldStyle}
              />
              <input
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                placeholder="Avatar URL (optional)"
                style={fieldStyle}
              />
              <input
                name="twitter_url"
                value={form.twitter_url}
                onChange={handleChange}
                placeholder="Twitter URL (optional)"
                style={fieldStyle}
              />
              <input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="Instagram URL (optional)"
                style={fieldStyle}
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={fieldStyle}
              >
                <option value="trader">Trader</option>
                <option value="super_admin">Super Admin</option>
              </select>

              <button
                type="submit"
                disabled={creating}
                style={{
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontWeight: 800,
                  cursor: "pointer",
                  opacity: creating ? 0.7 : 1,
                }}
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              border: "1px solid rgba(229,231,235,0.8)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#111827" }}>Existing Users</h2>

            {loading ? (
              <div style={{ color: "#6b7280" }}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={{ color: "#6b7280" }}>No users found.</div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {users.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 14,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={member.avatar_url || "/logo.png"}
                        alt={member.display_name}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 999,
                          background: "#fff",
                          border: "2px solid #f3f4f6",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: "#111827" }}>
                          {member.display_name}
                        </div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                          @{member.public_slug} · {member.email}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={tagStyle}>{member.role}</span>
                      <Link
                        to={`/trader/${member.public_slug}`}
                        style={{
                          textDecoration: "none",
                          color: "#2563eb",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        View Public Page
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

const tagStyle = {
  display: "inline-block",
  background: "#f3f4f6",
  color: "#111827",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

export default AdminUsersPage;
