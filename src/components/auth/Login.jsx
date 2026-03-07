import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axiosInstance from "./../../api/axiosInstance";
import { useAuth } from "./../../context/Auth/UseAuth";
import loginImg from "./../../assets/auth/login.png";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const redirectParam = new URLSearchParams(location.search).get("redirect");
  const redirect = redirectParam ? decodeURIComponent(redirectParam) : "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", { email, password, remember });
      const res = response.data;
      login(res.data.user, res.data.token);
      navigate(redirect, { replace: true });
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        @keyframes mcFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mcSpin { to { transform: rotate(360deg); } }
        .mc-fade-up { animation: mcFadeUp 0.45s ease both; }
        .mc-d1 { animation-delay: 0.05s; }
        .mc-d2 { animation-delay: 0.12s; }
        .mc-d3 { animation-delay: 0.19s; }
        .mc-d4 { animation-delay: 0.25s; }
        .mc-d5 { animation-delay: 0.31s; }
        .mc-d6 { animation-delay: 0.37s; }
        .mc-d7 { animation-delay: 0.43s; }
        .mc-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: mcSpin 0.6s linear infinite;
        }
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
          border: none; border-radius: 12px;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          letter-spacing: 0.01em;
        }
        .mc-btn:hover:not(:disabled) {
          background: #2F5C3A;
          box-shadow: 0 6px 20px rgba(47,92,58,0.28);
          transform: translateY(-1px);
        }
        .mc-btn:active { transform: translateY(0); }
        .mc-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .mc-panel::-webkit-scrollbar { width: 4px; }
        .mc-panel::-webkit-scrollbar-thumb { background: #C8C4BC; border-radius: 100px; }
      `}</style>

      <div className="mc-root flex h-screen w-screen overflow-hidden bg-[#F7F4EF]">

        {/* LEFT — Form */}
        <div className="mc-panel w-full max-w-[500px] flex-shrink-0 flex flex-col px-12 py-10 overflow-y-auto relative z-10 bg-[#F7F4EF]">

          {/* Logo */}
          <div className="mc-fade-up mc-d1 flex items-center gap-2.5 mb-12" style={{ opacity: 0 }}>
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#4A7C59,#2F5C3A)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div className="mc-serif text-xl text-[#0D1117] leading-none">MediCore</div>
              <div className="text-[11px] text-[#8A9BB0] mt-0.5">Healthcare Management Platform</div>
            </div>
          </div>

          {/* Heading */}
          <div className="mc-fade-up mc-d2 mb-8" style={{ opacity: 0 }}>
            <h1 className="mc-serif text-[34px] leading-tight text-[#0D1117]">
              Welcome <em className="text-[#4A7C59] italic">back</em>
            </h1>
            <p className="text-sm text-[#8A9BB0] mt-2 leading-relaxed">
              Sign in to continue managing your clinic.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Email */}
            <div className="mc-fade-up mc-d3 mb-5" style={{ opacity: 0 }}>
              <label htmlFor="email" className="block text-[13px] font-semibold text-[#0D1117] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@gracehealth.ng"
                  autoComplete="email"
                  className={`mc-input${errors.email ? " mc-input-error" : ""}`}
                  style={{ paddingLeft: 42 }}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-[#C05C3C] mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mc-fade-up mc-d4 mb-5" style={{ opacity: 0 }}>
              <label htmlFor="password" className="block text-[13px] font-semibold text-[#0D1117] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9BB0] pointer-events-none w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`mc-input${errors.password ? " mc-input-error" : ""}`}
                  style={{ paddingLeft: 42, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#8A9BB0] hover:text-[#0D1117] flex items-center transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-[#C05C3C] mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="mc-fade-up mc-d5 flex items-center justify-between mb-7" style={{ opacity: 0 }}>
              <label className="flex items-center gap-2 text-[13px] text-[#8A9BB0] cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#4A7C59]"
                />
                Remember me for 30 days
              </label>
              <Link
                to="/forgot-password"
                className="text-[13px] text-[#4A7C59] font-semibold no-underline hover:text-[#2F5C3A] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <p className="text-[13px] text-[#C05C3C] text-center mb-4">{errors.submit}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mc-fade-up mc-d6 mc-btn"
              style={{ opacity: 0 }}
            >
              {loading ? (
                <div className="mc-spinner" />
              ) : (
                <>
                  <span>Sign in</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mc-fade-up mc-d7 mt-8 text-center text-[13px] text-[#8A9BB0]" style={{ opacity: 0 }}>
            New to MediCore?{" "}
            <Link to="/reg" className="text-[#4A7C59] font-semibold no-underline hover:text-[#2F5C3A] transition-colors">
              Register your clinic
            </Link>
          </div>
        </div>

        {/* RIGHT — Full bleed image with green overlay */}
        <div className="flex-1 relative hidden md:block overflow-hidden">
          <img
            src={loginImg}
            alt="Healthcare professional"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Green overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(145deg,rgba(13,17,23,0.55) 0%,rgba(16,32,21,0.65) 40%,rgba(26,51,34,0.75) 75%,rgba(47,92,58,0.88) 100%)" }}
          />

          {/* Centred copy */}
          <div className="absolute inset-0 flex flex-col justify-center px-14">
            <h2
              className="mc-serif text-white leading-tight mb-5"
              style={{ fontSize: "clamp(30px,3.2vw,46px)" }}
            >
              Healthcare, <em className="italic" style={{ color: "#6BA37A" }}>organised</em>
              <br />from one platform.
            </h2>
            <p
              className="text-[15px] leading-[1.75] max-w-[400px]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              MediCore brings together clinic operations, patient records, billing,
              prescriptions, and lab results — so every team member has what they
              need, when they need it.
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;