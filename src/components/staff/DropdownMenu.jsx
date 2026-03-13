import { useEffect, useRef, useState } from "react";



export default function DropdownMenu({ children, trigger }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handle = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    const handleOpen = (e) => {
        e.stopPropagation();
        if (!open && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + window.scrollY + 4, right: window.innerWidth - r.right });
        }
        setOpen((o) => !o);
    };

    return (
        <>
            <div ref={btnRef}>{trigger(handleOpen, open)}</div>
            {open && (
                <div
                    ref={menuRef}
                    style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
                    className="bg-white border border-black/[0.09] rounded-xl shadow-[0_8px_32px_rgba(13,17,23,0.18)] min-w-[170px] overflow-hidden"
                    onClick={() => setOpen(false)}
                >
                    {children}
                </div>
            )}
        </>
    );
}