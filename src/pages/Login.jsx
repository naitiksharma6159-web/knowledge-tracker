import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Brain, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Form validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          login(email, email.split("@")[0]); // store simple session
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(data.detail || "Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <Brain style={styles.logo} size={48} />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to access your study insights</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <CheckCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail style={styles.inputIcon} size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock style={styles.inputIcon} size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    padding: "24px",
    background: "var(--bg-dark, #0f172a)",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    color: "var(--primary, #6366f1)",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    fontSize: "14px",
    marginBottom: "24px",
  },
  successAlert: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    color: "#86efac",
    fontSize: "14px",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#cbd5e1",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    color: "#64748b",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 42px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  footerText: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "#94a3b8",
    margin: "24px 0 0 0",
  },
  link: {
    color: "var(--primary, #6366f1)",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
