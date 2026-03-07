import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, GitBranch, Phone, MapPin, Globe, Check, Loader2 } from "lucide-react";
import { useClinicStore, useStateStore } from "../../../store/store";
import axiosInstance from "../../../api/axiosInstance";


const inputStyle = {
    width: "100%",
    paddingRight: "0.875rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    fontSize: 14,
    background: "#fff",
    borderRadius: 10,
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: '"DM Sans", sans-serif',
    color: "#0D1117",
};

function Field({ label, name, value, onChange, placeholder, icon: Icon, error, type = "text" }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>{label}</label>
            <div className="relative">
                {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8A9BB0" }} />}
                <input
                    type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                    style={{ ...inputStyle, paddingLeft: Icon ? "2.1rem" : "0.875rem", border: `1px solid ${error ? "#E8927C" : "rgba(13,17,23,0.12)"}` }}
                    onFocus={e => { if (!error) e.target.style.borderColor = "#4A7C59"; }}
                    onBlur={e => { if (!error) e.target.style.borderColor = "rgba(13,17,23,0.12)"; }}
                />
            </div>
            {error && <p className="text-[12px]" style={{ color: "#E8927C" }}>{error}</p>}
        </div>
    );
}

function SelectField({ label, name, value, onChange, options, icon: Icon, placeholder }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>{label}</label>
            <div className="relative">
                {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8A9BB0" }} />}
                <select
                    name={name} value={value} onChange={onChange}
                    style={{ ...inputStyle, paddingLeft: Icon ? "2.1rem" : "0.875rem", appearance: "none", paddingRight: "2rem", border: "1px solid rgba(13,17,23,0.12)", color: value ? "#0D1117" : "#8A9BB0", cursor: "pointer" }}
                    onFocus={e => (e.target.style.borderColor = "#4A7C59")}
                    onBlur={e => (e.target.style.borderColor = "rgba(13,17,23,0.12)")}
                >
                    <option value="" disabled>{placeholder ?? "Select…"}</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#8A9BB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

export default function AddBranchModal({ clinicId, clinicName, open, onClose, onSuccess }) {
    const { fetchStates, states } = useStateStore();
    const { clinics, setSelectedClinic, selectedClinic, fetchClinics } = useClinicStore();

    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state_id: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isLimitError, setIsLimitError] = useState(false);
    const overlayRef = useRef(null);

    useEffect(() => { fetchStates().catch(() => { }); }, []);

    useEffect(() => {
        if (open) {
            setForm({ name: "", phone: "", address: "", city: "", state_id: "" });
            setErrors({});
            setSubmitError("");
            setIsLimitError(false);
        }
    }, [open]);

    // close on overlay click
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    // close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const handle = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    };

    const submit = async () => {
        const e = {};
        if (!form.name.trim()) e.name = "Branch name is required";
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        setSubmitError("");
        try {
            const res = await axiosInstance.post(`/clinics/${clinicId}/branches`, {
                name: form.name,
                phone: form.phone || undefined,
                address: form.address || undefined,
                city: form.city || undefined,
                state_id: form.state_id || undefined,
            });
            const branch = res.data?.data;

            // force-refresh clinics so the new branch appears in the switcher
            await fetchClinics(true);

            if (onSuccess) onSuccess(branch);
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message ?? "Failed to create branch. Try again.";
            const is403 = err.response?.status === 403;
            setIsLimitError(is403);
            setSubmitError(msg);
        } finally {
            setLoading(false);
        }
    };

    const stateOptions = states.map(s => ({ value: s.id, label: s.name }));

    if (!open) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            style={{ background: "rgba(13,17,23,0.55)", backdropFilter: "blur(4px)" }}
        >
            <div
                className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
                style={{ background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
            >
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(13,17,23,0.08)" }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FAF0ED" }}>
                            <GitBranch size={15} style={{ color: "#E8927C" }} />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold" style={{ color: "#0D1117", fontFamily: '"DM Serif Display", serif' }}>Add Branch</p>
                            <p className="text-[11px]" style={{ color: "#8A9BB0" }}>{clinicName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                        style={{ background: "rgba(13,17,23,0.05)", border: "none", cursor: "pointer", color: "#8A9BB0" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,17,23,0.10)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(13,17,23,0.05)")}
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* body */}
                <div className="p-5 flex flex-col gap-3.5">
                    <Field label="Branch Name" name="name" value={form.name} onChange={handle}
                        placeholder="e.g. Lekki Branch, Island Annex" icon={GitBranch} error={errors.name} />
                    <Field label="Phone" name="phone" value={form.phone} onChange={handle}
                        placeholder="+234 800 000 0000" icon={Phone} />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium" style={{ color: "rgba(13,17,23,0.7)" }}>Address</label>
                        <textarea
                            name="address" value={form.address} onChange={handle}
                            placeholder="Branch street address" rows={2}
                            style={{ ...inputStyle, padding: "10px 14px", border: "1px solid rgba(13,17,23,0.12)", resize: "none", display: "block" }}
                            onFocus={e => (e.target.style.borderColor = "#4A7C59")}
                            onBlur={e => (e.target.style.borderColor = "rgba(13,17,23,0.12)")}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="City" name="city" value={form.city} onChange={handle} placeholder="Lagos" icon={Globe} />
                        <SelectField label="State" name="state_id" value={form.state_id} onChange={handle}
                            options={stateOptions} icon={MapPin} placeholder="Select state" />
                    </div>

                    {submitError && (
                        <div className="rounded-xl px-4 py-3" style={{ background: isLimitError ? "#FFF8EC" : "#FAF0ED", border: `1px solid ${isLimitError ? "rgba(201,168,76,0.4)" : "rgba(232,146,124,0.3)"}` }}>
                            <p className="text-[13px] font-medium" style={{ color: isLimitError ? "#C9A84C" : "#E8927C" }}>
                                {submitError}
                            </p>
                            {isLimitError && (
                                <p className="text-[12px] mt-1" style={{ color: "rgba(201,168,76,0.8)" }}>
                                    Upgrade your plan to add more branches.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* footer */}
                <div className="px-5 pb-5 flex gap-2.5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-[13px] font-medium rounded-xl transition-colors"
                        style={{ background: "rgba(13,17,23,0.06)", border: "none", cursor: "pointer", color: "#8A9BB0", fontFamily: '"DM Sans", sans-serif' }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,17,23,0.10)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(13,17,23,0.06)")}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-white rounded-xl transition-colors border-none"
                        style={{ background: "#4A7C59", opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer", fontFamily: '"DM Sans", sans-serif' }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2F5C3A"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#4A7C59"; }}
                    >
                        {loading ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : <><Check size={14} /> Create Branch</>}
                    </button>
                </div>
            </div>
        </div>
        , document.body);
}