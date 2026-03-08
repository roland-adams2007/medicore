import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Activity, Building2, MapPin, Phone, Mail, GitBranch,
    ChevronRight, ChevronLeft, Check, Loader2, Globe,
    Plus, ArrowRight, CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/Auth/UseAuth";
import { useClinicStore, useStateStore } from "../store/store";
import axiosInstance from "../api/axiosInstance";

const STEPS = [
    { id: 1, label: "Clinic Info" },
    { id: 2, label: "Location" },
    { id: 3, label: "First Branch" },
];

const inputBase = {
    width: "100%",
    paddingRight: "0.875rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    fontSize: 14,
    background: "#fff",
    borderRadius: 12,
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: '"DM Sans", sans-serif',
    color: "#0D1117",
};

const textareaStyle = {
    ...inputBase,
    padding: "10px 14px",
    border: "1px solid rgba(13,17,23,0.12)",
    resize: "none",
    display: "block",
};

function FIELD({ label, name, value, onChange, placeholder, type = "text", icon: Icon, error, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>
                {label}{required && <span className="ml-0.5" style={{ color: "#E8927C" }}>*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8A9BB0" }} />}
                <input
                    type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                    style={{ ...inputBase, paddingLeft: Icon ? "2.25rem" : "0.875rem", border: `1px solid ${error ? "#E8927C" : "rgba(13,17,23,0.12)"}` }}
                    onFocus={e => { if (!error) e.target.style.borderColor = "#4A7C59"; }}
                    onBlur={e => { if (!error) e.target.style.borderColor = "rgba(13,17,23,0.12)"; }}
                />
            </div>
            {error && <p className="text-[12px]" style={{ color: "#E8927C" }}>{error}</p>}
        </div>
    );
}

function SELECT_FIELD({ label, name, value, onChange, options, icon: Icon, error, required, placeholder }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>
                {label}{required && <span className="ml-0.5" style={{ color: "#E8927C" }}>*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8A9BB0" }} />}
                <select
                    name={name} value={value} onChange={onChange}
                    style={{ ...inputBase, paddingLeft: Icon ? "2.25rem" : "0.875rem", appearance: "none", paddingRight: "2rem", border: `1px solid ${error ? "#E8927C" : "rgba(13,17,23,0.12)"}`, color: value ? "#0D1117" : "#8A9BB0", cursor: "pointer" }}
                    onFocus={e => { if (!error) e.target.style.borderColor = "#4A7C59"; }}
                    onBlur={e => { if (!error) e.target.style.borderColor = "rgba(13,17,23,0.12)"; }}
                >
                    <option value="" disabled>{placeholder ?? "Select…"}</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: "#8A9BB0" }} />
            </div>
            {error && <p className="text-[12px]" style={{ color: "#E8927C" }}>{error}</p>}
        </div>
    );
}

function ClinicCard({ clinic, selected, onClick }) {
    const initials = clinic.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
    const hasBranches = clinic.branches?.length > 0;
    return (
        <button onClick={onClick} className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left" style={{ border: `2px solid ${selected ? "#4A7C59" : "rgba(13,17,23,0.10)"}`, background: selected ? "#E8F2EB" : "#fff", cursor: "pointer" }}>
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ background: selected ? "#4A7C59" : "#8A9BB0" }}>
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium truncate" style={{ color: "#0D1117" }}>{clinic.name}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "#8A9BB0" }}>
                    {hasBranches
                        ? `${clinic.branches.length} branch${clinic.branches.length !== 1 ? "es" : ""}`
                        : <span style={{ color: "#E8927C" }}>No branches yet</span>}
                </p>
            </div>
            {selected && <CheckCircle2 size={18} style={{ color: "#4A7C59", flexShrink: 0 }} />}
            {!hasBranches && !selected && (
                <span className="text-[11px] font-semibold px-2 py-1 rounded-lg shrink-0" style={{ background: "#FAF0ED", color: "#E8927C" }}>Setup needed</span>
            )}
        </button>
    );
}

function BranchForm({ states, onSubmit, loading, error: submitError }) {
    const [form, setForm] = useState({ branch_name: "", branch_phone: "", branch_address: "", branch_city: "", branch_state_id: "" });
    const [errors, setErrors] = useState({});

    const handle = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    };

    const submit = () => {
        const e = {};
        if (!form.branch_name.trim()) e.branch_name = "Branch name is required";
        if (Object.keys(e).length) { setErrors(e); return; }
        onSubmit(form);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FAF0ED" }}>
                    <GitBranch size={14} style={{ color: "#E8927C" }} />
                </div>
                <div>
                    <h2 className="text-[18px]" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>Add a Branch</h2>
                    <p className="text-[12px]" style={{ color: "#8A9BB0" }}>This clinic has no branches yet. Add one to continue.</p>
                </div>
            </div>
            <FIELD label="Branch Name" name="branch_name" value={form.branch_name} onChange={handle} placeholder="e.g. Main Branch, Lekki Branch" icon={GitBranch} error={errors.branch_name} required />
            <FIELD label="Phone" name="branch_phone" value={form.branch_phone} onChange={handle} placeholder="+234 800 000 0000" icon={Phone} />
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>Address</label>
                <textarea name="branch_address" value={form.branch_address} onChange={handle} placeholder="Branch street address" rows={2} style={textareaStyle}
                    onFocus={e => (e.target.style.borderColor = "#4A7C59")} onBlur={e => (e.target.style.borderColor = "rgba(13,17,23,0.12)")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <FIELD label="City" name="branch_city" value={form.branch_city} onChange={handle} placeholder="Lagos" icon={Globe} />
                <SELECT_FIELD label="State" name="branch_state_id" value={form.branch_state_id} onChange={handle} options={states} icon={MapPin} placeholder="Select state" />
            </div>
            {submitError && (
                <div className="text-[13px] rounded-xl px-4 py-3" style={{ background: "#FAF0ED", border: "1px solid rgba(232,146,124,0.3)", color: "#E8927C" }}>{submitError}</div>
            )}
            <button onClick={submit} disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white rounded-xl border-none mt-1"
                style={{ background: "#4A7C59", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer", fontFamily: '"DM Sans", sans-serif' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2F5C3A"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#4A7C59"; }}>
                {loading ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : <><Check size={15} /> Create Branch</>}
            </button>
        </div>
    );
}

export default function RegClinic() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const forceNew = searchParams.get("mode") === "new";
    const { user } = useAuth();
    const { clinics, addClinic, setSelectedClinic, fetchClinics, initialized, initialize } = useClinicStore();
    const { fetchStates, states } = useStateStore();

    // "loading" | "select" | "new-clinic" | "need-branch"
    const [pageState, setPageState] = useState("loading");
    const [selectedId, setSelectedId] = useState(null);
    const [branchLoading, setBranchLoading] = useState(false);
    const [branchError, setBranchError] = useState("");

    const [step, setStep] = useState(1);
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state_id: "", branch_name: "", branch_address: "", branch_phone: "", branch_city: "", branch_state_id: "" });

    const stateOptions = states.map(s => ({ value: s.id, label: s.name }));
    const firstName = user?.fname ?? user?.name?.split(" ")[0] ?? "there";

    useEffect(() => { fetchStates().catch(() => { }); }, []);

    useEffect(() => { if (!initialized) initialize(); }, [initialized, initialize]);

    useEffect(() => {
        if (!initialized) return;
        // ?mode=new → skip straight to wizard regardless of existing clinics
        if (forceNew) { setPageState("new-clinic"); return; }
        fetchClinics(true)
            .then(fetched => setPageState(!fetched || fetched.length === 0 ? "new-clinic" : "select"))
            .catch(() => setPageState("new-clinic"));
    }, [initialized, forceNew]);

    const handle = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    };

    const validate = (s) => {
        const e = {};
        if (s === 1) {
            if (!form.name.trim()) e.name = "Clinic name is required";
            if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        }
        if (s === 3 && !form.branch_name.trim()) e.branch_name = "Branch name is required";
        return e;
    };

    const next = () => {
        const e = validate(step);
        if (Object.keys(e).length) { setErrors(e); return; }
        setStep(p => p + 1);
    };

    const back = () => setStep(p => p - 1);

    const submitNewClinic = async () => {
        const e = validate(step);
        if (Object.keys(e).length) { setErrors(e); return; }
        setFormLoading(true);
        setSubmitError("");
        try {
            const res = await axiosInstance.post("/clinics/create", {
                name: form.name,
                email: form.email || undefined,
                phone: form.phone || undefined,
                address: form.address || undefined,
                city: form.city || undefined,
                state_id: form.state_id || undefined,
                branch: {
                    name: form.branch_name,
                    address: form.branch_address || undefined,
                    phone: form.branch_phone || undefined,
                    city: form.branch_city || undefined,
                    state_id: form.branch_state_id || undefined,
                },
            });

            const clinic = res.data?.data?.clinic; // ✅ correctly nested
            if (clinic) {
                addClinic(clinic); // handles auto-select internally now
            }

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setSubmitError(err.response?.data?.message ?? "Something went wrong. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEnterClinic = () => {
        const clinic = clinics.find(c => c.id === selectedId);
        if (!clinic) return;
        if (!clinic.branches || clinic.branches.length === 0) { setPageState("need-branch"); return; }
        setSelectedClinic({
            id: clinic.id,
            name: clinic.name,
            branch: clinic.branches[0].name,
            branchId: clinic.branches[0].id,
            role: clinic.role ?? null,
            roles: clinic.roles ?? [],
        });
        navigate("/dashboard", { replace: true });
    };

    const handleCreateBranch = async (branchForm) => {
        const clinic = clinics.find(c => c.id === selectedId);
        if (!clinic) return;
        setBranchLoading(true);
        setBranchError("");
        try {
            const res = await axiosInstance.post(`/clinics/${clinic.id}/branches`, {
                name: branchForm.branch_name,
                phone: branchForm.branch_phone || undefined,
                address: branchForm.branch_address || undefined,
                city: branchForm.branch_city || undefined,
                state_id: branchForm.branch_state_id || undefined,
            });
            const branch = res.data?.data;
            setSelectedClinic({
                id: clinic.id,
                name: clinic.name,
                branch: branch?.name ?? branchForm.branch_name,
                branchId: branch?.id ?? null,
                role: clinic.role ?? null,
                roles: clinic.roles ?? [],
            });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setBranchError(err.response?.data?.message ?? "Failed to create branch. Try again.");
        } finally {
            setBranchLoading(false);
        }
    };

    if (pageState === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F4EF" }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "#4A7C59" }}>
                        <Activity size={20} color="#fff" />
                    </div>
                    <Loader2 size={20} className="animate-spin" style={{ color: "#4A7C59" }} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#F7F4EF" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .fu { animation: fadeUp 0.35s ease forwards; }
                .fu-d1 { animation: fadeUp 0.35s 0.05s ease both; }
                .fu-d2 { animation: fadeUp 0.35s 0.10s ease both; }
                .fu-d3 { animation: fadeUp 0.35s 0.15s ease both; }
            `}</style>

            <div className="flex items-center gap-2.5 px-6 py-5" style={{ borderBottom: "1px solid rgba(13,17,23,0.08)" }}>
                <div className="w-8 h-8 rounded-[9px] flex items-center justify-center" style={{ background: "#4A7C59" }}>
                    <Activity size={16} color="#fff" />
                </div>
                <span className="text-[17px]" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>MediCore</span>
            </div>

            <div className="flex-1 flex items-start justify-center px-4 py-10">
                <div className="w-full max-w-lg">

                    {/* ── SELECT CLINIC ── */}
                    {pageState === "select" && (
                        <div className="fu">
                            <div className="mb-7">
                                <h1 className="text-[28px] leading-tight" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>Welcome back, {firstName}</h1>
                                <p className="text-[14px] mt-1.5" style={{ color: "#8A9BB0" }}>Choose a clinic to enter or create a new one.</p>
                            </div>

                            <div className="flex flex-col gap-2.5 mb-5">
                                {clinics.map((clinic, i) => (
                                    <div key={clinic.id} className={`fu-d${Math.min(i + 1, 3)}`}>
                                        <ClinicCard clinic={clinic} selected={selectedId === clinic.id} onClick={() => setSelectedId(clinic.id)} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px" style={{ background: "rgba(13,17,23,0.10)" }} />
                                <span className="text-[12px]" style={{ color: "#8A9BB0" }}>or</span>
                                <div className="flex-1 h-px" style={{ background: "rgba(13,17,23,0.10)" }} />
                            </div>

                            <button
                                onClick={() => { setPageState("new-clinic"); setStep(1); }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium transition-all"
                                style={{ border: "2px dashed rgba(13,17,23,0.15)", color: "#4A7C59", background: "transparent", cursor: "pointer", fontFamily: '"DM Sans", sans-serif' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#4A7C59"; e.currentTarget.style.background = "#E8F2EB"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(13,17,23,0.15)"; e.currentTarget.style.background = "transparent"; }}
                            >
                                <Plus size={15} /> Create a new clinic
                            </button>

                            {selectedId && (
                                <button onClick={handleEnterClinic}
                                    className="w-full flex items-center justify-center gap-2 py-3 mt-3 rounded-xl text-[13px] font-medium text-white border-none"
                                    style={{ background: "#4A7C59", cursor: "pointer", fontFamily: '"DM Sans", sans-serif' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#2F5C3A")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#4A7C59")}>
                                    Enter Clinic <ArrowRight size={15} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── NEED BRANCH ── */}
                    {pageState === "need-branch" && (
                        <div className="fu">
                            <div className="mb-7">
                                <h1 className="text-[28px] leading-tight" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>One more step</h1>
                                <p className="text-[14px] mt-1.5" style={{ color: "#8A9BB0" }}>
                                    <strong style={{ color: "#0D1117" }}>{clinics.find(c => c.id === selectedId)?.name}</strong> has no branches yet. Create one to continue.
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid rgba(13,17,23,0.10)" }}>
                                <BranchForm states={stateOptions} onSubmit={handleCreateBranch} loading={branchLoading} error={branchError} />
                            </div>
                            <button onClick={() => setPageState("select")}
                                className="flex items-center gap-1.5 mt-4 text-[13px] bg-transparent border-none cursor-pointer"
                                style={{ color: "#8A9BB0", fontFamily: '"DM Sans", sans-serif' }}>
                                <ChevronLeft size={15} /> Back to clinics
                            </button>
                        </div>
                    )}

                    {/* ── NEW CLINIC WIZARD ── */}
                    {pageState === "new-clinic" && (
                        <div>
                            <div className="mb-8 fu">
                                <h1 className="text-[28px] leading-tight" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>Set up your clinic</h1>
                                <p className="text-[14px] mt-1.5" style={{ color: "#8A9BB0" }}>Welcome, {firstName}. Let's get your clinic on MediCore.</p>
                            </div>

                            {/* stepper */}
                            <div className="flex items-center gap-0 mb-8">
                                {STEPS.map((s, i) => (
                                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-200"
                                                style={{ background: step > s.id ? "#4A7C59" : step === s.id ? "#0D1117" : "rgba(13,17,23,0.10)", color: step > s.id || step === s.id ? "#fff" : "#8A9BB0" }}>
                                                {step > s.id ? <Check size={14} /> : s.id}
                                            </div>
                                            <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: step === s.id ? "#0D1117" : "#8A9BB0" }}>{s.label}</span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div className="flex-1 h-px mx-3 mb-4 transition-colors" style={{ background: step > s.id ? "#4A7C59" : "rgba(13,17,23,0.12)" }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid rgba(13,17,23,0.10)" }}>
                                {step === 1 && (
                                    <div className="flex flex-col gap-4 fu">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#E8F2EB" }}><Building2 size={14} style={{ color: "#4A7C59" }} /></div>
                                            <h2 className="text-[18px]" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>Clinic Information</h2>
                                        </div>
                                        <FIELD label="Clinic Name" name="name" value={form.name} onChange={handle} placeholder="e.g. Grace Health Clinic" icon={Building2} error={errors.name} required />
                                        <FIELD label="Email Address" name="email" value={form.email} onChange={handle} placeholder="clinic@example.com" type="email" icon={Mail} error={errors.email} />
                                        <FIELD label="Phone Number" name="phone" value={form.phone} onChange={handle} placeholder="+234 800 000 0000" icon={Phone} error={errors.phone} />
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="flex flex-col gap-4 fu">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FBF6E9" }}><MapPin size={14} style={{ color: "#C9A84C" }} /></div>
                                            <h2 className="text-[18px]" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>Clinic Location</h2>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>Address</label>
                                            <textarea name="address" value={form.address} onChange={handle} placeholder="Street address" rows={2} style={textareaStyle}
                                                onFocus={e => (e.target.style.borderColor = "#4A7C59")} onBlur={e => (e.target.style.borderColor = "rgba(13,17,23,0.12)")} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <FIELD label="City" name="city" value={form.city} onChange={handle} placeholder="Lagos" icon={Globe} error={errors.city} />
                                            <SELECT_FIELD label="State" name="state_id" value={form.state_id} onChange={handle} options={stateOptions} icon={MapPin} error={errors.state_id} placeholder="Select state" />
                                        </div>
                                    </div>
                                )}
                                {step === 3 && (
                                    <div className="flex flex-col gap-4 fu">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FAF0ED" }}><GitBranch size={14} style={{ color: "#E8927C" }} /></div>
                                            <div>
                                                <h2 className="text-[18px]" style={{ fontFamily: '"DM Serif Display", serif', color: "#0D1117" }}>First Branch</h2>
                                                <p className="text-[12px]" style={{ color: "#8A9BB0" }}>You can add more branches later from settings.</p>
                                            </div>
                                        </div>
                                        <FIELD label="Branch Name" name="branch_name" value={form.branch_name} onChange={handle} placeholder="e.g. Main Branch, Lekki Branch" icon={GitBranch} error={errors.branch_name} required />
                                        <FIELD label="Phone" name="branch_phone" value={form.branch_phone} onChange={handle} placeholder="+234 800 000 0000" icon={Phone} error={errors.branch_phone} />
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>Address</label>
                                            <textarea name="branch_address" value={form.branch_address} onChange={handle} placeholder="Branch address (leave blank to use clinic address)" rows={2} style={textareaStyle}
                                                onFocus={e => (e.target.style.borderColor = "#4A7C59")} onBlur={e => (e.target.style.borderColor = "rgba(13,17,23,0.12)")} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <FIELD label="City" name="branch_city" value={form.branch_city} onChange={handle} placeholder="Lagos" icon={Globe} error={errors.branch_city} />
                                            <SELECT_FIELD label="State" name="branch_state_id" value={form.branch_state_id} onChange={handle} options={stateOptions} icon={MapPin} error={errors.branch_state_id} placeholder="Select state" />
                                        </div>
                                        {submitError && (
                                            <div className="text-[13px] rounded-xl px-4 py-3" style={{ background: "#FAF0ED", border: "1px solid rgba(232,146,124,0.3)", color: "#E8927C" }}>{submitError}</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                <div>
                                    {step > 1 ? (
                                        <button onClick={back}
                                            className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium rounded-xl bg-white border cursor-pointer transition-colors"
                                            style={{ color: "#8A9BB0", borderColor: "rgba(13,17,23,0.12)", fontFamily: '"DM Sans", sans-serif' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = "#0D1117"; e.currentTarget.style.borderColor = "rgba(13,17,23,0.25)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = "#8A9BB0"; e.currentTarget.style.borderColor = "rgba(13,17,23,0.12)"; }}>
                                            <ChevronLeft size={15} /> Back
                                        </button>
                                    ) : clinics.length > 0 ? (
                                        <button onClick={() => forceNew ? navigate(-1) : setPageState("select")}
                                            className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium rounded-xl bg-white border cursor-pointer"
                                            style={{ color: "#8A9BB0", borderColor: "rgba(13,17,23,0.12)", fontFamily: '"DM Sans", sans-serif' }}>
                                            <ChevronLeft size={15} /> {forceNew ? "Back" : "My Clinics"}
                                        </button>
                                    ) : <div />}
                                </div>

                                {step < STEPS.length ? (
                                    <button onClick={next}
                                        className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-medium text-white rounded-xl border-none cursor-pointer"
                                        style={{ background: "#4A7C59", fontFamily: '"DM Sans", sans-serif' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#2F5C3A")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "#4A7C59")}>
                                        Continue <ChevronRight size={15} />
                                    </button>
                                ) : (
                                    <button onClick={submitNewClinic} disabled={formLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white rounded-xl border-none"
                                        style={{ background: "#4A7C59", opacity: formLoading ? 0.6 : 1, cursor: formLoading ? "not-allowed" : "pointer", fontFamily: '"DM Sans", sans-serif' }}
                                        onMouseEnter={e => { if (!formLoading) e.currentTarget.style.background = "#2F5C3A"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "#4A7C59"; }}>
                                        {formLoading ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : <><Check size={15} /> Create Clinic</>}
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-[12px] mt-5" style={{ color: "#8A9BB0" }}>Step {step} of {STEPS.length}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}