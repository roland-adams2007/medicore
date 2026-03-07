import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useAuth } from "./../../context/Auth/UseAuth";
import regImg from "./../../assets/auth/reg.png";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "./../../context/Alert/UseAlert";

const getStrength = (val) => {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
};

const strengthMeta = {
  1: { label: "Weak", color: "#E8927C" },
  2: { label: "Fair", color: "#C9A84C" },
  3: { label: "Good", color: "#C9A84C" },
  4: { label: "Strong", color: "#4A7C59" },
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = password ? getStrength(password) : 0;
  const meta = strengthMeta[strength] || null;

  const clearError = (key) => setErrors((p) => ({ ...p, [key]: undefined }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!fname) newErrors.fname = "First name is required";
    if (!lname) newErrors.lname = "Last name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address";
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", { fname, lname, email, password });
      const res = response.data;
      if (res.status != 200) {
        setErrors({ submit: res.message || "Failed to register" });
      } else {
        setFname(""); setLname(""); setEmail(""); setPassword("");
        showAlert(res.message || "Registration successful", "success");
        navigate("/login");
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        .mc-root * { box-sizing: border-box; }
        .mc-serif  { font-family: 'DM Serif Display', serif; }
        .mc-sans   { font-family: 'DM Sans', sans-serif; }

        @keyframes mcFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mcFloatIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mcSpin { to { transform: rotate(360deg); } }

        .mc-fade-up { animation: mcFadeUp 0.4s ease both; }
        .mc-d1  { animation-delay: 0.05s; }
        .mc-d2  { animation-delay: 0.08s; }
        .mc-d3  { animation-delay: 0.12s; }
        .mc-d4  { animation-delay: 0.16s; }
        .mc-d5  { animation-delay: 0.20s; }
        .mc-d6  { animation-delay: 0.24s; }
        .mc-d7  { animation-delay: 0.28s; }
        .mc-d8  { animation-delay: 0.32s; }
        .mc-d9  { animation-delay: 0.36s; }

        .mc-how-step {
          opacity: 0; transform: translateY(14px);
          animation: mcFloatIn 0.5s ease forwards;
        }
        .mc-how-step:nth-child(1) { animation-delay: 0.15s; }
        .mc-how-step:nth-child(2) { animation-delay: 0.30s; }
        .mc-how-step:nth-child(3) { animation-delay: 0.45s; }
        .mc-how-step:nth-child(4) { animation-delay: 0.60s; }

        .mc-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border: 1.5px solid rgba(13,17,23,0.1);
          border-radius: 12px;
          outline: none;
          color: #0D1117;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .mc-input::placeholder { color: #B0B8C4; }
        .mc-input:focus {
          border-color: #4A7C59;
          box-shadow: 0 0 0 4px rgba(74,124,89,0.1);
        }
        .mc-input-error {
          border-color: #E8927C !important;
          box-shadow: 0 0 0 4px rgba(232,146,124,0.12) !important;
        }
        .mc-btn {
          width: 100%; padding: 14px;
          background: #4A7C59; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          border: none; border-radius: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .mc-btn:hover:not(:disabled) {
          background: #2F5C3A;
          box-shadow: 0 6px 20px rgba(47,92,58,0.28);
          transform: translateY(-1px);
        }
        .mc-btn:active  { transform: translateY(0); }
        .mc-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .mc-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: mcSpin 0.6s linear infinite;
        }
        .mc-panel::-webkit-scrollbar { width: 4px; }
        .mc-panel::-webkit-scrollbar-thumb { background: #C8C4BC; border-radius: 100px; }
      `}</style>

      <div className="mc-root mc-sans flex h-screen w-screen overflow-hidden" style={{ background: "#F7F4EF", color: "#0D1117" }}>

        {/* ── LEFT: Form ── */}
        <div className="mc-panel w-full flex-shrink-0 flex flex-col overflow-y-auto relative z-10" style={{ maxWidth: 520, background: "#F7F4EF", padding: "36px 48px" }}>

          {/* Logo */}
          <div className="mc-fade-up mc-d1 flex items-center gap-2.5 mb-10" style={{ opacity: 0 }}>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#4A7C59,#2F5C3A)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div className="mc-serif" style={{ fontSize: 20, color: "#0D1117", lineHeight: 1 }}>MediCore</div>
              <div style={{ fontSize: 11, color: "#8A9BB0", marginTop: 2 }}>Healthcare Management Platform</div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mc-fade-up mc-d2 flex items-center mb-8" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12, fontWeight: 600 }}>
              <div className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: "50%", background: "#4A7C59", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</div>
              <span style={{ color: "#2F5C3A", whiteSpace: "nowrap" }}>Your Account</span>
            </div>
            <div className="flex-1 mx-2.5" style={{ height: 1.5, background: "#E8E4DC" }} />
            <div className="flex items-center gap-2" style={{ fontSize: 12, fontWeight: 600 }}>
              <div className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: "50%", background: "#E8E4DC", color: "#8A9BB0", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</div>
              <span style={{ color: "#8A9BB0", whiteSpace: "nowrap" }}>Clinic Setup</span>
            </div>
          </div>

          {/* Header */}
          <div className="mc-fade-up mc-d3 mb-7" style={{ opacity: 0 }}>
            <h1 className="mc-serif" style={{ fontSize: 30, lineHeight: 1.2, color: "#0D1117" }}>
              Create your <em className="italic" style={{ color: "#4A7C59" }}>account</em>
            </h1>
            <p style={{ fontSize: 14, color: "#8A9BB0", marginTop: 8, lineHeight: 1.6 }}>
              Set up your personal login. You'll add your clinic details next.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Name row */}
            <div className="mc-fade-up mc-d4 grid grid-cols-2 gap-3.5 mb-4" style={{ opacity: 0 }}>
              <div>
                <label htmlFor="fname" className="block font-semibold mb-1.5" style={{ fontSize: 13, color: "#0D1117" }}>First name</label>
                <div className="relative">
                  <User className="absolute top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" style={{ left: 14 }} />
                  <input
                    type="text" id="fname" value={fname} placeholder="Adaeze" autoComplete="given-name"
                    onChange={(e) => { setFname(e.target.value); clearError("fname"); }}
                    className={`mc-input${errors.fname ? " mc-input-error" : ""}`}
                  />
                </div>
                {errors.fname && <p style={{ fontSize: 12, color: "#C05C3C", marginTop: 5 }}>{errors.fname}</p>}
              </div>
              <div>
                <label htmlFor="lname" className="block font-semibold mb-1.5" style={{ fontSize: 13, color: "#0D1117" }}>Last name</label>
                <div className="relative">
                  <User className="absolute top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" style={{ left: 14 }} />
                  <input
                    type="text" id="lname" value={lname} placeholder="Obi" autoComplete="family-name"
                    onChange={(e) => { setLname(e.target.value); clearError("lname"); }}
                    className={`mc-input${errors.lname ? " mc-input-error" : ""}`}
                  />
                </div>
                {errors.lname && <p style={{ fontSize: 12, color: "#C05C3C", marginTop: 5 }}>{errors.lname}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="mc-fade-up mc-d5 mb-4" style={{ opacity: 0 }}>
              <label htmlFor="email" className="block font-semibold mb-1.5" style={{ fontSize: 13, color: "#0D1117" }}>Email address</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" style={{ left: 14 }} />
                <input
                  type="email" id="email" value={email} placeholder="adaeze@yourname.ng" autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  className={`mc-input${errors.email ? " mc-input-error" : ""}`}
                />
              </div>
              {errors.email && <p style={{ fontSize: 12, color: "#C05C3C", marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mc-fade-up mc-d6 mb-5" style={{ opacity: 0 }}>
              <label htmlFor="password" className="block font-semibold mb-1.5" style={{ fontSize: 13, color: "#0D1117" }}>Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" style={{ left: 14 }} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password" value={password} placeholder="Create a strong password" autoComplete="new-password"
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  className={`mc-input${errors.password ? " mc-input-error" : ""}`}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                  style={{ right: 14, color: "#8A9BB0" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= strength ? meta?.color : "#E8E4DC", transition: "background 0.2s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: meta?.color }}>{meta?.label}</p>
                </div>
              )}
              {errors.password && <p style={{ fontSize: 12, color: "#C05C3C", marginTop: 5 }}>{errors.password}</p>}
            </div>

            {errors.submit && (
              <p className="text-center mb-4" style={{ fontSize: 13, color: "#C05C3C" }}>{errors.submit}</p>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="mc-fade-up mc-d7 mc-btn" style={{ opacity: 0 }}>
              {loading ? (
                <div className="mc-spinner" />
              ) : (
                <>
                  <span>Create account</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mc-fade-up mc-d9 text-center" style={{ opacity: 0, marginTop: 24, fontSize: 13, color: "#8A9BB0" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4A7C59", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#2F5C3A"}
              onMouseLeave={e => e.target.style.color = "#4A7C59"}>
              Sign in
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Full bleed image ── */}
        <div className="flex-1 relative overflow-hidden hidden md:block">
          <img
            src={regImg}
            alt="Healthcare"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(145deg,rgba(13,17,23,0.55) 0%,rgba(16,32,21,0.65) 40%,rgba(26,51,34,0.75) 75%,rgba(47,92,58,0.88) 100%)" }} />
          <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "0 52px" }}>
            <h2 className="mc-serif text-white leading-tight mb-5" style={{ fontSize: "clamp(30px,3.2vw,46px)" }}>
              Your clinic,<br /><em className="italic" style={{ color: "#6BA37A" }}>fully digital</em> in minutes.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 400, lineHeight: 1.75 }}>
              Join over 140 clinics across Nigeria already streamlining their operations on MediCore.
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;