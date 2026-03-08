import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown, Building2, GitBranch, Check, AlertCircle, Plus } from "lucide-react";
import AddBranchModal from "./modals/AddBranchModal";

export default function ClinicSwitcher({ clinics, selectedClinic, onSelect }) {
  const [open, setOpen] = useState(false);
  const [branchModal, setBranchModal] = useState(null); // { clinicId, clinicName }
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!selectedClinic) return null;

  const initials = (name) =>
    name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const isSelected = (clinicId, branchId) =>
    selectedClinic.id === clinicId && selectedClinic.branchId === branchId;

  const handleAddBranch = (e, clinic) => {
    e.stopPropagation();
    setOpen(false);
    setBranchModal({ clinicId: clinic.id, clinicName: clinic.name });
  };

  const handleBranchCreated = (branch) => {
    if (!branch || !branchModal) return;

    // Always switch to the newly created branch
    onSelect({
      id: branchModal.clinicId,
      name: branchModal.clinicName,
      branch: branch.name,
      branchId: branch.id,
    });
  };

  return (
    <>
      <div
        style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative" }}
        ref={ref}
      >
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", background: "rgba(255,255,255,0.05)",
            border: "none", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <div style={{ width: 28, height: 28, background: "#6BA37A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {initials(selectedClinic.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedClinic.name}
            </p>
            <p style={{ color: "#8A9BB0", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedClinic.branch ?? "No branch selected"}
            </p>
          </div>
          <ChevronsUpDown size={15} style={{ color: "#8A9BB0", flexShrink: 0 }} />
        </button>

        {open && (
          <div style={{
            position: "absolute", left: 16, right: 16, top: "100%", marginTop: 4,
            zIndex: 50, background: "#161C26",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            overflow: "hidden", maxHeight: 320, overflowY: "auto",
          }}>
            {clinics.map((clinic) => (
              <div key={clinic.id}>
                {/* clinic header */}
                <div style={{ padding: "10px 12px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Building2 size={11} style={{ color: "#8A9BB0" }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#8A9BB0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {clinic.name}
                    </span>
                  </div>
                  {/* only owner can add branches — role is on the clinic object */}
                  {(clinic.role === "owner" || clinic.role === "admin") && (
                    <button
                      onClick={(e) => handleAddBranch(e, clinic)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 11, color: "#4A7C59", fontWeight: 600,
                        background: "rgba(74,124,89,0.12)", border: "none",
                        borderRadius: 6, padding: "3px 8px", cursor: "pointer", transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,124,89,0.22)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(74,124,89,0.12)")}
                    >
                      <Plus size={11} /> Branch
                    </button>
                  )}
                </div>

                {/* branches list */}
                {clinic.branches.length === 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 10px", opacity: 0.5 }}>
                    <AlertCircle size={13} style={{ color: "#E8927C" }} />
                    <span style={{ fontSize: 12, color: "#8A9BB0" }}>No branches yet</span>
                  </div>
                ) : (
                  clinic.branches.map((branch) => {
                    const active = isSelected(clinic.id, branch.id);
                    return (
                      <button
                        key={branch.id}
                        onClick={() => {
                          onSelect({ id: clinic.id, name: clinic.name, branch: branch.name, branchId: branch.id });
                          setOpen(false);
                        }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 12px",
                          background: active ? "rgba(74,124,89,0.2)" : "transparent",
                          border: "none", cursor: "pointer", transition: "background 0.12s", textAlign: "left",
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                      >
                        <GitBranch size={13} style={{ color: active ? "#4A7C59" : "rgba(138,155,176,0.5)", flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, color: active ? "#fff" : "#8A9BB0", fontWeight: active ? 500 : 400 }}>
                          {branch.name}
                        </span>
                        {active && <Check size={13} style={{ color: "#4A7C59", flexShrink: 0 }} />}
                      </button>
                    );
                  })
                )}
              </div>
            ))}

            <div style={{ padding: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => { setOpen(false); navigate("/reg/clinic?mode=new"); }}
                style={{
                  width: "100%", fontSize: 12, color: "#4A7C59", fontWeight: 600,
                  padding: "6px 0", background: "none", border: "none",
                  cursor: "pointer", borderRadius: 8, transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,124,89,0.10)")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                + Add Clinic
              </button>
            </div>
          </div>
        )}
      </div>

      {branchModal && (
        <AddBranchModal
          open={!!branchModal}
          clinicId={branchModal.clinicId}
          clinicName={branchModal.clinicName}
          onClose={() => setBranchModal(null)}
          onSuccess={handleBranchCreated}
        />
      )}
    </>
  );
}