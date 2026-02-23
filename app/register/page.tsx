"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async () => {
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/upload");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .page {
          min-height: 100vh;
          background: #f0f2f5;
          display: flex;
          flex-direction: column;
        }

        .nav {
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 56px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
        }
        .nav-logo-icon {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .nav-links {
          display: flex;
          gap: 4px;
        }
        .nav-link {
          color: #94a3b8;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #fff; }

        .main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 44px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
        }

        .card-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .card-logo-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0f172a;
          font-weight: 700;
          font-size: 18px;
        }
        .card-logo-icon {
          width: 38px;
          height: 38px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 6px;
        }
        .card-subtitle {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          margin-bottom: 32px;
        }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
          background: #f8fafc;
        }
        .form-input:focus {
          border-color: #3b82f6;
          background: #fff;
        }
        .form-input::placeholder { color: #94a3b8; }
        .form-input.valid { border-color: #22c55e; }
        .form-input.invalid { border-color: #ef4444; }

        .strength-bar-wrap {
          margin-top: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .strength-seg {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          background: #e2e8f0;
          transition: background 0.25s;
        }
        .strength-label {
          font-size: 11px;
          font-weight: 600;
          margin-left: 6px;
          min-width: 36px;
        }

        .terms {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 22px;
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }
        .terms input[type="checkbox"] {
          margin-top: 2px;
          accent-color: #3b82f6;
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .terms-link { color: #3b82f6; font-weight: 500; cursor: pointer; }
        .terms-link:hover { text-decoration: underline; }

        .btn-register {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-register:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 6px 18px rgba(59,130,246,0.45);
          transform: translateY(-1px);
        }
        .btn-register:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .error-msg {
          color: #ef4444;
          font-size: 13px;
          text-align: center;
          margin-top: 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 8px 12px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
          color: #94a3b8;
          font-size: 12px;
        }
        .divider-line { flex: 1; height: 1px; background: #e2e8f0; }

        .login-row {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin-top: 20px;
        }
        .login-link {
          color: #3b82f6;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }
        .login-link:hover { text-decoration: underline; }

        .badge-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }
        .badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #64748b;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

        .spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="page">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">📄</div>
            Resume Studio
          </div>
          <div className="nav-links">
            <button className="nav-link">Dashboard</button>
            <button className="nav-link">Optimizer</button>
            <button className="nav-link">Templates</button>
            <button className="nav-link">Career Insights</button>
          </div>
          <div style={{ width: 120 }} />
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="card">
            <div className="card-logo">
              <div className="card-logo-inner">
                <div className="card-logo-icon">📄</div>
                Resume Studio
              </div>
            </div>

            <h1 className="card-title">Create your account</h1>
            <p className="card-subtitle">Start optimizing your resume with AI — it's free</p>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input${fullName.trim().length > 1 ? " valid" : ""}`}
                type="text"
                placeholder="Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && register()}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className={`form-input${email.includes("@") && email.includes(".") ? " valid" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && register()}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && register()}
              />
              {password.length > 0 && (
                <div className="strength-bar-wrap">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="strength-seg"
                      style={{ background: strength >= i ? strengthColor[strength] : "#e2e8f0" }}
                    />
                  ))}
                  <span className="strength-label" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className={`form-input${
                  confirmPassword.length > 0
                    ? confirmPassword === password
                      ? " valid"
                      : " invalid"
                    : ""
                }`}
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && register()}
              />
            </div>

            {/* Terms */}
            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the <span className="terms-link">Terms of Service</span> and{" "}
                <span className="terms-link">Privacy Policy</span>
              </label>
            </div>

            <button className="btn-register" onClick={register} disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Creating account...</>
              ) : (
                <>✨ Create Free Account</>
              )}
            </button>

            {error && <div className="error-msg">⚠ {error}</div>}

            <div className="divider">
              <div className="divider-line" />
              <span>already have an account?</span>
              <div className="divider-line" />
            </div>

            <div className="login-row">
              <a className="login-link" href="/login">Sign in instead</a>
            </div>

            <div className="badge-row">
              <span className="badge"><span className="badge-dot" /> AI-Powered</span>
              <span className="badge"><span className="badge-dot" /> ATS Optimized</span>
              <span className="badge"><span className="badge-dot" /> Free to Start</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}