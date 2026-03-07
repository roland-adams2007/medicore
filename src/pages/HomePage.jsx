import { useAuth } from "../context/Auth/UseAuth";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Activity, ArrowRight, PlayCircle, CheckCircle, Receipt, Star,
  Sparkles, CalendarDays, FileHeart, Pill, FlaskConical, Users,
  ShieldCheck, BarChart2, MessageCircle, CalendarCheck, Banknote,
  Zap, UserPlus, Building2, Rocket, Tag, Twitter, Linkedin,
  Instagram, Facebook, Menu, X, Check, ChevronRight
} from "lucide-react";

const COLORS = {
  sage: "#4A7C59",
  sageLight: "#6BA37A",
  sageDark: "#2F5C3A",
  sagePale: "#E8F2EB",
  blush: "#E8927C",
  blushPale: "#FAF0ED",
  gold: "#C9A84C",
  goldPale: "#FBF6E9",
  slate: "#8A9BB0",
  ink: "#0D1117",
  paper: "#F7F4EF",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay } }),
};

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealDiv({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <motion.div ref={ref} initial="hidden" animate={visible ? "visible" : "hidden"} custom={delay} variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

function OrbitalRing({ size, duration, reverse, balls }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size, height: size,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        border: "1.5px solid rgba(74,124,89,0.22)",
        animation: `spin${reverse ? "Rev" : ""} ${duration}s linear infinite`,
      }}
    >
      {balls.map((b, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: b.size, height: b.size,
            background: `radial-gradient(circle at 35% 35%, ${b.color1}, ${b.color2})`,
            boxShadow: `0 0 ${b.glow}px ${b.color1}`,
            top: b.top ?? "auto", bottom: b.bottom ?? "auto",
            left: b.left ?? "auto", right: b.right ?? "auto",
          }}
        />
      ))}
    </div>
  );
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ color: COLORS.sage, background: COLORS.sagePale, letterSpacing: "0.1em" }}>
      <Icon size={12} />
      {children}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [["#features", "Features"], ["#how", "How it works"], ["#testimonials", "Reviews"], ["#pricing", "Pricing"], ["#", "Blog"]];
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: 68,
          background: scrolled ? "rgba(247,244,239,0.96)" : "rgba(247,244,239,0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          borderBottom: "1px solid rgba(13,17,23,0.08)",
          boxShadow: scrolled ? "0 2px 24px rgba(13,17,23,0.07)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center">
          <a href="#" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})` }}>
              <Activity size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="font-serif text-lg" style={{ color: COLORS.ink, fontFamily: "'DM Serif Display', serif" }}>MediCore</span>
          </a>
          <ul className="hidden md:flex items-center gap-1 ml-9 list-none">
            {links.map(([href, label]) => (
              <li key={label}>
                <a href={href} className="text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all duration-150 no-underline" style={{ color: COLORS.slate }} onMouseEnter={e => { e.target.style.color = COLORS.ink; e.target.style.background = "rgba(13,17,23,0.05)"; }} onMouseLeave={e => { e.target.style.color = COLORS.slate; e.target.style.background = "transparent"; }}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="ml-auto hidden md:flex items-center gap-2.5">
            <a href="/login" className="text-sm font-semibold px-4 py-2 rounded-xl border transition-all duration-150 no-underline" style={{ color: COLORS.ink, borderColor: "rgba(13,17,23,0.09)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.sage; e.currentTarget.style.background = COLORS.sagePale; e.currentTarget.style.color = COLORS.sageDark; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,17,23,0.09)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.ink; }}>Sign in</a>
            <a href="/register" className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl text-white no-underline transition-all duration-150" style={{ background: COLORS.sage }} onMouseEnter={e => { e.currentTarget.style.background = COLORS.sageDark; e.currentTarget.style.boxShadow = "0 4px 16px rgba(47,92,58,0.3)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.background = COLORS.sage; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              Get started free <ArrowRight size={14} />
            </a>
          </div>
          <button className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-xl border" style={{ borderColor: "rgba(13,17,23,0.09)", background: "none", cursor: "pointer", color: COLORS.ink }} onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            className="fixed z-40 left-0 right-0 flex flex-col gap-1 px-6 pb-6 pt-4"
            style={{ top: 68, background: "rgba(247,244,239,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(13,17,23,0.08)" }}
          >
            {links.map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="text-sm font-medium px-3.5 py-3 rounded-xl no-underline transition-all" style={{ color: COLORS.ink }} onMouseEnter={e => { e.target.style.background = COLORS.sagePale; }} onMouseLeave={e => { e.target.style.background = "transparent"; }}>{label}</a>
            ))}
            <div className="flex gap-2.5 mt-3">
              <a href="/login" className="flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-xl border no-underline" style={{ color: COLORS.ink, borderColor: "rgba(13,17,23,0.09)" }}>Sign in</a>
              <a href="/register" className="flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-xl text-white no-underline" style={{ background: COLORS.sage }}>Get started free</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: COLORS.paper, paddingTop: 68 }}>
      <style>{`
        @keyframes spinRev { from { transform: translate(-50%,-50%) rotate(360deg); } to { transform: translate(-50%,-50%) rotate(0deg); } }
        @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
      `}</style>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, background: COLORS.sage, top: -100, right: -150, filter: "blur(100px)", opacity: 0.16 }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: COLORS.gold, bottom: 0, left: -100, filter: "blur(100px)", opacity: 0.1 }} />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(13,17,23,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(13,17,23,0.09) 1px, transparent 1px)`, backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%)" }} />
      </div>
      <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none z-0" style={{ width: 700, height: 700 }}>
        <div className="absolute rounded-full" style={{ width: 70, height: 70, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle at 40% 35%, rgba(74,124,89,0.3), rgba(47,92,58,0.08))", border: "1px solid rgba(74,124,89,0.35)", boxShadow: "0 0 40px rgba(74,124,89,0.2), inset 0 0 20px rgba(74,124,89,0.12)" }} />
        {[
          { size: 220, dur: 12, rev: false, balls: [{ size: 13, color1: "#6BA37A", color2: "#2F5C3A", glow: 14, top: "-6px", left: "calc(50% - 6px)" }, { size: 9, color1: "#C9A84C", color2: "#8a6f2a", glow: 12, bottom: "-3px", left: "calc(50% - 4px)" }] },
          { size: 340, dur: 20, rev: true, balls: [{ size: 17, color1: "#E8927C", color2: "#c05c3c", glow: 18, top: "-8px", left: "calc(50% - 8px)" }, { size: 11, color1: "#6BA37A", color2: "#2F5C3A", glow: 14, bottom: "-3px", left: "calc(50% - 5px)" }, { size: 7, color1: "#fff", color2: "#8A9BB0", glow: 10, top: "calc(50% - 3px)", left: "-3px" }] },
          { size: 460, dur: 28, rev: false, balls: [{ size: 15, color1: "#C9A84C", color2: "#8a6f2a", glow: 18, top: "-7px", left: "calc(50% - 7px)" }, { size: 11, color1: "#E8927C", color2: "#c05c3c", glow: 14, bottom: "-4px", left: "calc(50% - 5px)" }, { size: 7, color1: "#6BA37A", color2: "#2F5C3A", glow: 10, top: "calc(50% - 3px)", right: "-3px" }, { size: 9, color1: "#fff", color2: "rgba(138,155,176,0.8)", glow: 12, top: "calc(50% - 4px)", left: "-4px" }] },
          { size: 580, dur: 38, rev: true, balls: [{ size: 19, color1: "#4A7C59", color2: "#1a3322", glow: 22, top: "-9px", left: "calc(50% - 9px)" }, { size: 12, color1: "#C9A84C", color2: "#8a6f2a", glow: 16, bottom: "-4px", left: "calc(50% - 6px)" }, { size: 8, color1: "#E8927C", color2: "#c05c3c", glow: 12, top: "calc(50% - 4px)", left: "-4px" }] },
          { size: 680, dur: 50, rev: false, balls: [{ size: 14, color1: "#6BA37A", color2: "#2F5C3A", glow: 16, top: "-7px", left: "calc(50% - 7px)" }, { size: 10, color1: "#E8927C", color2: "#c05c3c", glow: 14, top: "calc(50% - 5px)", right: "-5px" }] },
        ].map((r, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: r.size, height: r.size, top: "50%", left: "50%", border: "1.5px solid rgba(74,124,89,0.2)", animation: `${r.rev ? "spinRev" : "spin"} ${r.dur}s linear infinite`, transform: "translate(-50%,-50%)" }}>
            {r.balls.map((b, j) => (
              <div key={j} className="absolute rounded-full" style={{ width: b.size, height: b.size, background: `radial-gradient(circle at 35% 35%, ${b.color1}, ${b.color2})`, boxShadow: `0 0 ${b.glow}px ${b.color1}`, top: b.top, bottom: b.bottom, left: b.left, right: b.right }} />
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border" style={{ color: COLORS.sageDark, background: COLORS.sagePale, borderColor: "rgba(74,124,89,0.2)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS.sage, animation: "pdot 2s infinite" }} />
              Now live in 36 states across Nigeria
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-serif leading-tight mb-6" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px,5vw,62px)", color: COLORS.ink }}>
              Run your clinic<br /><em style={{ color: COLORS.sage }}>smarter,</em> not<br />harder.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="leading-relaxed mb-9" style={{ fontSize: "clamp(15px,1.5vw,17px)", color: COLORS.slate, maxWidth: 480 }}>
              MediCore is the all-in-one platform that helps clinics in Nigeria manage appointments, patient records, billing, prescriptions, and lab results — from one beautiful dashboard.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap gap-3 mb-9">
              <a href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm no-underline transition-all duration-150" style={{ background: COLORS.sage }} onMouseEnter={e => { e.currentTarget.style.background = COLORS.sageDark; e.currentTarget.style.boxShadow = "0 8px 28px rgba(47,92,58,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = COLORS.sage; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                Start free trial <ArrowRight size={16} />
              </a>
              <a href="#features" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm no-underline border transition-all duration-150" style={{ color: COLORS.ink, borderColor: "rgba(13,17,23,0.09)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.sage; e.currentTarget.style.background = COLORS.sagePale; e.currentTarget.style.color = COLORS.sageDark; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,17,23,0.09)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.ink; }}>
                <PlayCircle size={16} /> See how it works
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex items-center gap-3">
              <div className="flex">
                {[["#4A7C59", "AO"], ["#C9A84C", "KB"], ["#E8927C", "MN"], ["#8A9BB0", "FO"]].map(([bg, init], i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white" style={{ background: bg, marginLeft: i === 0 ? 0 : -10 }}>{init}</div>
                ))}
              </div>
              <div className="text-sm leading-snug" style={{ color: COLORS.slate }}>Trusted by <strong style={{ color: COLORS.ink }}>142+ clinics</strong><br />across Nigeria — 14-day free trial</div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="relative">
            <div className="absolute z-10 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border text-xs font-semibold whitespace-nowrap shadow-lg" style={{ top: -16, right: -20, borderColor: "rgba(13,17,23,0.09)", color: COLORS.ink, animation: "floatY 3s ease-in-out infinite" }}>
              <CheckCircle size={15} color={COLORS.sage} /> Appointment booked — 09:00 AM
            </div>
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: COLORS.ink, boxShadow: "0 24px 60px rgba(13,17,23,0.22)" }}>
              <div className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, background: "rgba(74,124,89,0.15)", top: -40, right: -40 }} />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <p className="font-serif text-white text-base" style={{ fontFamily: "'DM Serif Display', serif" }}>Today's Overview</p>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Thu, 5 Mar 2026</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-3 relative z-10">
                {[
                  { label: "Appointments", val: "47", sub: "↑ 6 more than yesterday", valColor: "#fff" },
                  { label: "Walk-ins", val: "8", sub: "Queue: 65% capacity", valColor: "#fff" },
                  { label: "Revenue Today", val: "₦186k", sub: "4 invoices pending", valColor: COLORS.gold },
                  { label: "Patients Seen", val: "18", sub: "29 remaining today", valColor: COLORS.sage },
                ].map(({ label, val, sub, valColor }) => (
                  <div key={label} className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>{label}</div>
                    <div className="font-serif text-2xl leading-none" style={{ fontFamily: "'DM Serif Display', serif", color: valColor }}>{val}</div>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5 relative z-10">
                {[
                  { init: "DB", bg: COLORS.sage, name: "Dr. Bello", role: "Gen. Practice · In consultation", badge: "Active", badgeBg: "rgba(74,124,89,0.2)", badgeColor: "#6BA37A" },
                  { init: "IO", bg: COLORS.gold, name: "Dr. Okafor", role: "Cardiology · Available", badge: "Free", badgeBg: "rgba(255,255,255,0.08)", badgeColor: "rgba(255,255,255,0.5)" },
                ].map(({ init, bg, name, role, badge, badgeBg, badgeColor }) => (
                  <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: bg }}>{init}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{name}</p>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute z-10 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border text-xs font-semibold whitespace-nowrap shadow-lg" style={{ bottom: 30, left: -28, borderColor: "rgba(13,17,23,0.09)", color: COLORS.ink, animation: "floatY 3.5s ease-in-out infinite 0.5s" }}>
              <Receipt size={15} color={COLORS.blush} /> Invoice INV-2841 · ₦12,500
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LogosSection() {
  const clinics = ["Grace Health Clinic", "Harmony Care", "Sunrise Total Health", "Nova Prime Medical", "VitalCare Centre", "BrightMed Clinic", "PrimeMed Hospital", "ClearLife Medical"];
  const chips = [
    { init: "GH", bg: COLORS.sagePale, color: COLORS.sage, name: clinics[0] },
    { init: "HC", bg: COLORS.goldPale, color: COLORS.gold, name: clinics[1] },
    { init: "ST", bg: COLORS.blushPale, color: COLORS.blush, name: clinics[2] },
    { init: "NP", bg: "#F5F0F8", color: "#6A3D85", name: clinics[3] },
    { init: "VC", bg: "#EEF2F7", color: COLORS.slate, name: clinics[4] },
    { init: "BM", bg: COLORS.sagePale, color: COLORS.sage, name: clinics[5] },
    { init: "PM", bg: COLORS.goldPale, color: COLORS.gold, name: clinics[6] },
    { init: "CL", bg: COLORS.blushPale, color: COLORS.blush, name: clinics[7] },
  ];
  const all = [...chips, ...chips];
  return (
    <div className="border-t border-b overflow-hidden" style={{ borderColor: "rgba(13,17,23,0.09)", background: "#fff" }}>
      <p className="text-center text-xs font-semibold uppercase tracking-widest py-7 pb-4" style={{ color: COLORS.slate, letterSpacing: "0.1em" }}>Trusted by clinics across Nigeria</p>
      <style>{`@keyframes scrollTrack { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      <div className="overflow-hidden relative pb-7">
        <div className="absolute top-0 bottom-0 left-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
        <div className="absolute top-0 bottom-0 right-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
        <div className="flex items-center gap-12" style={{ width: "max-content", animation: "scrollTrack 28s linear infinite" }}>
          {all.map(({ init, bg, color, name }, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors duration-150 cursor-default" style={{ color: "rgba(13,17,23,0.35)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0" style={{ background: bg, color }}>{init}</div>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { num: "142", sup: "+", label: "Active clinics", sub: "Across 36 states in Nigeria, growing every month." },
    { num: "9.4", sup: "k", label: "Registered patients", sub: "Patient records securely stored and instantly searchable." },
    { num: "60", sup: "%", label: "Less admin time", sub: "Clinics report spending significantly less time on paperwork." },
    { pre: "₦", num: "1.2B", label: "Transactions processed", sub: "Invoices, payments, and receipts managed on MediCore." },
  ];
  return (
    <section className="py-20" style={{ background: COLORS.paper }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv>
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border" style={{ background: "rgba(13,17,23,0.09)", borderColor: "rgba(13,17,23,0.09)" }}>
            {stats.map(({ num, sup, pre, label, sub }) => (
              <div key={label} className="p-9 transition-colors duration-200 cursor-default group" style={{ background: "#fff" }} onMouseEnter={e => e.currentTarget.style.background = COLORS.sagePale} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div className="font-serif mb-2 leading-none" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px,4vw,52px)", color: COLORS.ink }}>
                  {pre && <span style={{ color: COLORS.sage }}>{pre}</span>}{num}{sup && <span style={{ color: COLORS.sage }}>{sup}</span>}
                </div>
                <div className="text-sm font-medium mb-1.5" style={{ color: COLORS.ink }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: COLORS.slate }}>{sub}</div>
              </div>
            ))}
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: CalendarDays, bg: COLORS.sagePale, color: COLORS.sage, title: "Appointment Management", desc: "Book, reschedule, and track every appointment. Walk-in queue management with real-time wait estimates. Never double-book again.", tags: ["Walk-in queue", "Reminders", "Calendar view"] },
    { icon: FileHeart, bg: COLORS.goldPale, color: COLORS.gold, title: "Patient Records", desc: "Secure, searchable digital health records. Full history, consultation notes, allergies, conditions, and documents — all in one place.", tags: ["EMR", "History", "Documents"] },
    { icon: Receipt, bg: COLORS.blushPale, color: COLORS.blush, title: "Billing & Invoicing", desc: "Generate invoices in seconds, collect payments, track outstanding bills, and produce receipts. Full audit trail for every transaction.", tags: ["Invoices", "Payments", "Receipts"] },
    { icon: Pill, bg: COLORS.sagePale, color: COLORS.sage, title: "Prescriptions", desc: "Doctors issue digital prescriptions attached to the patient record. Patients can view and download their prescriptions from the portal.", tags: ["Digital Rx", "Refill requests", "History"] },
    { icon: FlaskConical, bg: "#EEF2F7", color: COLORS.slate, title: "Lab Requests & Results", desc: "Doctors request tests from within the platform. Lab results are uploaded and linked directly to the patient's record. No paper trail needed.", tags: ["Lab requests", "Results", "Notifications"] },
    { icon: Users, bg: COLORS.sagePale, color: COLORS.sage, title: "Multi-Role Access", desc: "Role-based dashboards for clinic admins, doctors, receptionists, nurses, and patients. Each role sees exactly what they need.", tags: ["Roles", "Permissions", "Multi-branch"] },
    { icon: ShieldCheck, bg: "#F5F0F8", color: "#6A3D85", title: "Security & Compliance", desc: "End-to-end encryption, role-based access control, and full audit logs. Your patient data is always protected and private.", tags: ["Encryption", "Audit log", "HIPAA-aligned"] },
    { icon: BarChart2, bg: COLORS.goldPale, color: COLORS.gold, title: "Reports & Analytics", desc: "Daily, weekly, and monthly reports on revenue, appointments, patient flow, and staff performance. Make data-driven decisions confidently.", tags: ["Revenue reports", "Trends", "Export"] },
    { icon: MessageCircle, bg: COLORS.blushPale, color: COLORS.blush, title: "Patient Portal & Messaging", desc: "Patients get their own portal to book appointments, view records, download reports, pay bills, and message their care team directly.", tags: ["Self-service", "Messaging", "Mobile-ready"] },
  ];
  return (
    <section id="features" className="py-24" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv className="text-center max-w-xl mx-auto mb-16">
          <Eyebrow icon={Sparkles}>Everything you need</Eyebrow>
          <h2 className="font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", color: COLORS.ink, lineHeight: 1.2 }}>
            Built for how <em style={{ color: COLORS.sage }}>Nigerian clinics</em> actually work
          </h2>
          <p className="text-base leading-relaxed" style={{ color: COLORS.slate }}>Every feature was designed with feedback from real clinic operators, doctors, and receptionists in Nigeria.</p>
        </RevealDiv>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, bg, color, title, desc, tags }, i) => (
            <RevealDiv key={title} delay={(i % 3) * 0.1}>
              <div className="p-7 rounded-2xl border cursor-default transition-all duration-200 h-full" style={{ background: COLORS.paper, borderColor: "rgba(13,17,23,0.09)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.sage; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(74,124,89,0.1)"; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,17,23,0.09)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = COLORS.paper; }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}><Icon size={22} color={color} /></div>
                <h3 className="font-serif text-lg mb-2.5" style={{ fontFamily: "'DM Serif Display', serif", color: COLORS.ink }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.slate }}>{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: COLORS.sagePale, color: COLORS.sageDark }}>{t}</span>)}
                </div>
              </div>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section id="feature-showcase" className="py-20" style={{ background: COLORS.paper }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <Eyebrow icon={CalendarCheck}>Appointments</Eyebrow>
            <h2 className="font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px,3.5vw,40px)", color: COLORS.ink, lineHeight: 1.2 }}>Full visibility on <em style={{ color: COLORS.sage }}>every patient</em>, every day.</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.slate }}>Your front desk, doctors, and managers all see the same live schedule — from check-in to consultation to discharge. No confusion, no missed appointments.</p>
            <ul className="flex flex-col gap-3">
              {["Live appointment timeline per doctor", "Walk-in queue with automatic wait-time estimates", "Automated SMS reminders to reduce no-shows", "Check-in tracking with room assignments"].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: COLORS.ink }}>
                  <div className="w-4.5 h-4.5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: COLORS.sage, width: 18, height: 18 }}><Check size={10} color="#fff" strokeWidth={3} /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: COLORS.ink, boxShadow: "0 20px 60px rgba(13,17,23,0.18)" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, background: "rgba(74,124,89,0.15)", top: -60, right: -60 }} />
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-base" style={{ fontFamily: "'DM Serif Display', serif", color: "rgba(255,255,255,0.9)" }}>Today's Schedule</span>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.sage, animation: "pdot 2s infinite" }} />Live
              </div>
            </div>
            {[
              { init: "CE", bg: COLORS.sage, name: "Chioma Eze", role: "09:00 AM · Dr. Bello · Room 3", badge: "In Progress", badgeBg: "rgba(74,124,89,0.2)", badgeColor: "#6BA37A", rowBg: "rgba(74,124,89,0.12)", rowBorder: "rgba(74,124,89,0.3)" },
              { init: "FA", bg: COLORS.gold, name: "Femi Adeyemi", role: "09:30 AM · Dr. Okafor · Cardio", badge: "Next", badgeBg: "rgba(201,168,76,0.15)", badgeColor: COLORS.gold },
              { init: "NN", bg: COLORS.blush, name: "Ngozi Nnadi", role: "10:00 AM · Dr. Adaeze · Paeds", badge: "Upcoming", badgeBg: "rgba(255,255,255,0.06)", badgeColor: "rgba(255,255,255,0.4)" },
              { init: "KA", bg: COLORS.slate, name: "Kemi Adeoye", role: "10:45 AM · Dr. Bello · Gen. Practice", badge: "Upcoming", badgeBg: "rgba(255,255,255,0.06)", badgeColor: "rgba(255,255,255,0.4)" },
            ].map(({ init, bg, name, role, badge, badgeBg, badgeColor, rowBg, rowBorder }) => (
              <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: rowBg || "rgba(255,255,255,0.04)", border: `1px solid ${rowBorder || "rgba(255,255,255,0.07)"}` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: bg }}>{init}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>{name}</p>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>
              </div>
            ))}
            <div className="flex justify-between mt-3.5 pt-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>47 appointments today</span>
              <span className="text-xs font-semibold" style={{ color: COLORS.sage }}>↑ 6 more than yesterday</span>
            </div>
          </div>
        </RevealDiv>
        <RevealDiv className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl p-6 relative overflow-hidden lg:order-1" style={{ background: COLORS.ink, boxShadow: "0 20px 60px rgba(13,17,23,0.18)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-base" style={{ fontFamily: "'DM Serif Display', serif", color: "rgba(255,255,255,0.9)" }}>Outstanding Invoices</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: COLORS.blushPale, color: "#C05C3C" }}>14 pending</span>
            </div>
            {[
              { init: "CE", bg: COLORS.blush, name: "INV-2841 · Chioma Eze", amount: "₦12,500 · Due today", btnLabel: "Collect", btnBg: COLORS.blush, btnColor: "#fff", rowBg: "rgba(232,146,124,0.1)", rowBorder: "rgba(232,146,124,0.25)" },
              { init: "FA", bg: COLORS.gold, name: "INV-2839 · Femi Adeyemi", amount: "₦35,000 · Due in 3 days", btnLabel: "Send", btnBg: "rgba(201,168,76,0.2)", btnColor: COLORS.gold },
              { init: "EC", bg: COLORS.sage, name: "INV-2837 · Emeka Chukwu", amount: "₦8,000 · Due in 5 days", btnLabel: "View", btnBg: "rgba(255,255,255,0.07)", btnColor: "rgba(255,255,255,0.5)" },
            ].map(({ init, bg, name, amount, btnLabel, btnBg, btnColor, rowBg, rowBorder }) => (
              <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: rowBg || "rgba(255,255,255,0.04)", border: `1px solid ${rowBorder || "rgba(255,255,255,0.07)"}` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: bg }}>{init}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{name}</p>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{amount}</span>
                </div>
                <button className="text-xs font-semibold px-2.5 py-1 rounded-md border-0 cursor-pointer" style={{ background: btnBg, color: btnColor }}>{btnLabel}</button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-3.5 pt-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Total outstanding</span>
              <span className="font-serif text-xl" style={{ fontFamily: "'DM Serif Display', serif", color: COLORS.blush }}>₦186,500</span>
            </div>
          </div>
          <div className="lg:order-2">
            <Eyebrow icon={Banknote}>Billing</Eyebrow>
            <h2 className="font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px,3.5vw,40px)", color: COLORS.ink, lineHeight: 1.2 }}>Get paid faster with <em style={{ color: COLORS.sage }}>smart billing</em>.</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.slate }}>Generate invoices instantly after consultation, track who has paid and who hasn't, and send automatic payment reminders — all without leaving MediCore.</p>
            <ul className="flex flex-col gap-3">
              {["One-click invoice generation post-consultation", "Track outstanding, paid, and overdue bills", "Automated reminders for unpaid invoices", "Detailed financial reports by day, week, or month"].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: COLORS.ink }}>
                  <div className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ background: COLORS.sage, width: 18, height: 18 }}><Check size={10} color="#fff" strokeWidth={3} /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    { icon: UserPlus, label: "Create your account", desc: "Sign up with your email. Takes 60 seconds — no credit card required.", active: true },
    { icon: Building2, label: "Register your clinic", desc: "Add your clinic details, location, and choose a subscription plan.", active: false },
    { icon: Users, label: "Invite your team", desc: "Doctors, nurses, receptionists — each gets the right dashboard for their role.", active: false },
    { icon: Rocket, label: "Go live", desc: "Start accepting appointments and managing patients from day one.", active: false },
  ];
  return (
    <section id="how" className="py-24" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv className="text-center max-w-lg mx-auto mb-16">
          <Eyebrow icon={Zap}>Simple setup</Eyebrow>
          <h2 className="font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", color: COLORS.ink, lineHeight: 1.2 }}>Up and running in <em style={{ color: COLORS.sage }}>minutes</em></h2>
          <p className="text-base leading-relaxed" style={{ color: COLORS.slate }}>Getting started with MediCore is simple. No IT team required.</p>
        </RevealDiv>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="absolute hidden lg:block" style={{ top: 36, left: "calc(12.5% + 12px)", right: "calc(12.5% + 12px)", height: 1.5, background: `linear-gradient(90deg, ${COLORS.sagePale}, ${COLORS.sage}, ${COLORS.sagePale})` }} />
          {steps.map(({ icon: Icon, label, desc, active }, i) => (
            <RevealDiv key={label} delay={i * 0.1} className="text-center px-4 relative z-10">
              <div className="w-18 h-18 rounded-full mx-auto mb-5 flex items-center justify-center border-2 transition-all duration-200" style={{ width: 72, height: 72, background: active ? COLORS.sage : "#fff", borderColor: active ? COLORS.sage : "rgba(13,17,23,0.09)", color: active ? "#fff" : COLORS.sage }}>
                <Icon size={28} />
              </div>
              <h3 className="font-serif text-lg mb-2.5" style={{ fontFamily: "'DM Serif Display', serif", color: COLORS.ink }}>{label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.slate }}>{desc}</p>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { quote: "MediCore cut our admin time by 60%. Our doctors spend more time with patients and less time on paperwork. It's transformed how we run the clinic.", name: "Grace Okonkwo", role: "Medical Director · Grace Health Clinic, Lagos", init: "GO", bg: COLORS.sage },
    { quote: "The receptionist dashboard is incredible. I can check in patients, assign them to doctors, collect payments, and manage walk-ins — all from one screen.", name: "Ada Ihejirika", role: "Head Receptionist · Sunrise Total Healthcare, Abuja", init: "AI", bg: COLORS.gold },
    { quote: "As a doctor, having the patient's entire history, vitals, and lab results on one screen before I walk into the room is a game changer. I feel more prepared.", name: "Dr. David Bello", role: "General Practitioner · Harmony Care Hospital, Kano", init: "DB", bg: COLORS.blush },
    { quote: "We went from paper records to a fully digital clinic in one afternoon. The patient portal is a huge hit — our patients love being able to see their own results.", name: "Kemi Adeyemi", role: "Admin · BrightMed Clinic, Ibadan", init: "KA", bg: COLORS.sageLight },
    { quote: "Billing used to be a nightmare. Now every invoice is generated automatically after a consultation. We've recovered thousands in outstanding payments since switching.", name: "Emmanuel Madu", role: "Finance Officer · Nova Prime Medical, Port Harcourt", init: "EM", bg: COLORS.slate },
    { quote: "We manage 3 branches on MediCore. Seeing all patient flow, revenue, and staff performance in one platform is exactly what we needed to scale responsibly.", name: "Fatima Nwosu", role: "CEO · VitalCare Medical Centre, Enugu", init: "FN", bg: COLORS.sage },
  ];
  const all = [...testimonials, ...testimonials];
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" style={{ background: COLORS.ink }}>
      <style>{`@keyframes scrollTesti { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -100, right: -100, background: "rgba(74,124,89,0.12)", filter: "blur(80px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, bottom: -80, left: 0, background: "rgba(201,168,76,0.08)", filter: "blur(80px)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv className="text-center max-w-lg mx-auto mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ color: "#6BA37A", background: "rgba(74,124,89,0.2)", letterSpacing: "0.1em" }}>
            <Star size={12} /> Testimonials
          </div>
          <h2 className="font-serif mb-4 text-white" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", lineHeight: 1.2 }}>
            Loved by clinic teams<br /><em style={{ color: COLORS.sageLight }}>across Nigeria</em>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Here's what medical professionals are saying about MediCore.</p>
        </RevealDiv>
      </div>
      <div className="overflow-hidden relative pb-2">
        <div className="absolute top-0 bottom-0 left-0 w-36 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${COLORS.ink}, transparent)` }} />
        <div className="absolute top-0 bottom-0 right-0 w-36 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${COLORS.ink}, transparent)` }} />
        <div className="flex gap-5 px-5" style={{ width: "max-content", animation: "scrollTesti 40s linear infinite" }}>
          {all.map(({ quote, name, role, init, bg }, i) => (
            <div key={i} className="rounded-2xl p-6 flex-shrink-0 cursor-default transition-all duration-200" style={{ width: 360, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(74,124,89,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "none"; }}
            >
              <div className="flex gap-1 mb-3.5" style={{ color: COLORS.gold }}>{"★★★★★".split("").map((s, j) => <span key={j} className="text-sm">{s}</span>)}</div>
              <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "rgba(255,255,255,0.75)" }}>"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border-2" style={{ background: bg, borderColor: "rgba(255,255,255,0.15)" }}>{init}</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    {
      tier: "Starter", monthlyPrice: "120k", annualPrice: "96k", period: "per month",
      desc: "For small clinics just getting started with digital management.", featured: false,
      features: ["Up to 10 staff accounts", "1 clinic branch", "Appointments & scheduling", "Basic patient records", "Invoicing & billing", "Email support"],
    },
    {
      tier: "Pro", monthlyPrice: "450k", annualPrice: "360k", period: "per month",
      desc: "For growing clinics that need the full platform across a team.", featured: true,
      features: ["Up to 50 staff accounts", "Up to 3 branches", "Full EMR & patient portal", "Lab requests & results", "Prescriptions management", "Advanced analytics", "Priority support"],
    },
    {
      tier: "Enterprise", monthlyPrice: null, annualPrice: null, period: "tailored to your network",
      desc: "For hospital networks and multi-branch operations with complex needs.", featured: false,
      features: ["Unlimited staff & branches", "Custom integrations", "White-label options", "Dedicated account manager", "Custom SLA & uptime", "24/7 phone support"],
    },
  ];
  return (
    <section id="pricing" className="py-24" style={{ background: COLORS.paper }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv className="text-center max-w-lg mx-auto mb-14">
          <Eyebrow icon={Tag}>Pricing</Eyebrow>
          <h2 className="font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", color: COLORS.ink, lineHeight: 1.2 }}>Simple, <em style={{ color: COLORS.sage }}>transparent</em> pricing</h2>
          <p className="text-base leading-relaxed" style={{ color: COLORS.slate }}>All plans include a 14-day free trial. No credit card required to start.</p>
        </RevealDiv>
        <RevealDiv className="flex items-center justify-center gap-3 mb-12">
          <span className="text-sm font-medium cursor-pointer" style={{ color: !isAnnual ? COLORS.ink : COLORS.slate, fontWeight: !isAnnual ? 600 : 500 }} onClick={() => setIsAnnual(false)}>Monthly</span>
          <div className="w-11 h-6 rounded-full relative cursor-pointer transition-all duration-200" style={{ background: COLORS.sage }} onClick={() => setIsAnnual(v => !v)}>
            <div className="absolute w-4.5 h-4.5 bg-white rounded-full transition-all duration-200" style={{ width: 18, height: 18, top: 3, left: isAnnual ? 20 : 3 }} />
          </div>
          <span className="text-sm font-medium cursor-pointer" style={{ color: isAnnual ? COLORS.ink : COLORS.slate, fontWeight: isAnnual ? 600 : 500 }} onClick={() => setIsAnnual(true)}>Annual</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: COLORS.blush }}>Save 20%</span>
        </RevealDiv>
        <RevealDiv className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-4xl lg:max-w-none mx-auto">
          {plans.map(({ tier, monthlyPrice, annualPrice, period, desc, featured, features }) => (
            <div key={tier} className="rounded-2xl p-8 relative transition-all duration-200" style={{ background: featured ? COLORS.ink : "#fff", border: `1.5px solid ${featured ? COLORS.sage : "rgba(13,17,23,0.09)"}`, boxShadow: featured ? "0 20px 60px rgba(13,17,23,0.2)" : "none" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = featured ? "0 28px 70px rgba(13,17,23,0.25)" : "0 16px 48px rgba(13,17,23,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = featured ? "0 20px 60px rgba(13,17,23,0.2)" : "none"; }}
            >
              {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold text-white tracking-wide" style={{ background: COLORS.sage }}>Most popular</div>}
              <div className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: featured ? "rgba(255,255,255,0.45)" : COLORS.slate, letterSpacing: "0.1em" }}>{tier}</div>
              <div className="font-serif leading-none mb-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: featured ? "#fff" : COLORS.ink }}>
                {monthlyPrice ? <><sup style={{ fontSize: 18, fontFamily: "inherit", verticalAlign: "top", marginTop: 8, display: "inline-block" }}>₦</sup>{isAnnual ? annualPrice : monthlyPrice}</> : "Custom"}
              </div>
              <div className="text-sm mb-5" style={{ color: featured ? "rgba(255,255,255,0.4)" : COLORS.slate }}>{period} · {isAnnual ? "billed annually" : "billed monthly"}</div>
              <div className="text-sm leading-relaxed mb-6" style={{ color: featured ? "rgba(255,255,255,0.55)" : COLORS.slate }}>{desc}</div>
              <div className="h-px mb-6" style={{ background: featured ? "rgba(255,255,255,0.1)" : "rgba(13,17,23,0.09)" }} />
              <ul className="flex flex-col gap-2.5 mb-7">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: featured ? "rgba(255,255,255,0.8)" : COLORS.ink }}>
                    <div className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: 18, height: 18, background: featured ? "rgba(74,124,89,0.25)" : COLORS.sagePale }}>
                      <Check size={10} color={COLORS.sage} strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border transition-all duration-150 cursor-pointer" style={{ background: featured ? COLORS.sage : "transparent", color: featured ? "#fff" : COLORS.ink, borderColor: featured ? COLORS.sage : "rgba(13,17,23,0.09)", fontFamily: "inherit" }}
                onMouseEnter={e => { if (featured) { e.target.style.background = COLORS.sageDark; e.target.style.boxShadow = "0 6px 20px rgba(47,92,58,0.3)"; } else { e.target.style.borderColor = COLORS.sage; e.target.style.background = COLORS.sagePale; e.target.style.color = COLORS.sageDark; } }}
                onMouseLeave={e => { if (featured) { e.target.style.background = COLORS.sage; e.target.style.boxShadow = "none"; } else { e.target.style.borderColor = "rgba(13,17,23,0.09)"; e.target.style.background = "transparent"; e.target.style.color = COLORS.ink; } }}
              >
                {tier === "Enterprise" ? "Contact sales" : "Start free trial"}
              </button>
            </div>
          ))}
        </RevealDiv>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealDiv>
          <div className="rounded-3xl px-12 py-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D1117 0%, #102015 50%, #1a3322 100%)" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: 300, height: 300, top: -60, right: -60, background: "rgba(74,124,89,0.2)", filter: "blur(60px)" }} />
            <div className="absolute rounded-full pointer-events-none" style={{ width: 240, height: 240, bottom: -60, left: -40, background: "rgba(201,168,76,0.1)", filter: "blur(60px)" }} />
            <h2 className="font-serif mb-4 text-white relative z-10" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", lineHeight: 1.2 }}>
              Ready to modernise<br />your <em style={{ color: COLORS.sageLight }}>clinic?</em>
            </h2>
            <p className="text-base leading-relaxed mb-9 relative z-10" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto 36px" }}>
              Join 142+ clinics already running smarter operations with MediCore. Start your free 14-day trial today — no credit card needed.
            </p>
            <div className="flex flex-wrap gap-3 justify-center relative z-10">
              <a href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm no-underline transition-all duration-150" style={{ background: COLORS.sage }} onMouseEnter={e => { e.currentTarget.style.background = COLORS.sageDark; e.currentTarget.style.boxShadow = "0 8px 28px rgba(47,92,58,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.background = COLORS.sage; e.currentTarget.style.boxShadow = "none"; }}>
                Get started free <ArrowRight size={15} />
              </a>
              <a href="#features" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm no-underline border transition-all duration-150" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "transparent"; }}>
                Explore features
              </a>
            </div>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

function Footer() {
  const socials = [{ icon: Twitter, label: "Twitter" }, { icon: Linkedin, label: "LinkedIn" }, { icon: Instagram, label: "Instagram" }, { icon: Facebook, label: "Facebook" }];
  const cols = [
    { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap", "API Docs"] },
    { title: "Company", links: ["About us", "Blog", "Careers", "Press", "Contact"] },
    { title: "Support", links: ["Help Centre", "Onboarding Guide", "Status page", "Security", "Privacy Policy"] },
  ];
  return (
    <footer className="pt-18 pb-8" style={{ background: COLORS.ink, paddingTop: 72 }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <a href="#" className="flex items-center gap-2.5 no-underline mb-3.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})` }}>
                <Activity size={16} color="#fff" strokeWidth={2.2} />
              </div>
              <span className="font-serif text-lg text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>MediCore</span>
            </a>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.38)", maxWidth: 260 }}>The all-in-one clinic management platform built for healthcare providers in Nigeria. Modern, fast, and secure.</p>
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-xl flex items-center justify-center no-underline transition-all duration-150" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }} onMouseEnter={e => { e.currentTarget.style.background = COLORS.sage; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = COLORS.sage; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3.5" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>{title}</h4>
              <ul className="flex flex-col gap-2 list-none">
                {links.map(link => (
                  <li key={link}><a href="#" className="text-sm no-underline transition-colors duration-150" style={{ color: "rgba(255,255,255,0.55)" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>© 2026 MediCore Technologies Ltd. All rights reserved. · Made with care for Nigerian healthcare.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map(l => (
              <a key={l} href="#" className="text-xs no-underline transition-colors duration-150" style={{ color: "rgba(255,255,255,0.3)" }} onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const HomePage = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <HeroSection />
      <LogosSection />
      <StatsSection />
      <FeaturesSection />
      <ShowcaseSection />
      <HowSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default HomePage;