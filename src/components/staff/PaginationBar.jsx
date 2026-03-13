export default function PaginationBar({ pagination, onPageChange }) {
    const { page, totalPages, total, hasNext, hasPrev } = pagination;
    const start = Math.max(1, Math.min(totalPages - 4, page - 2));
    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
            <p className="text-[11px] text-[#8A9BB0] order-2 sm:order-1">
                {total} total · Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap justify-center order-1 sm:order-2">
                <button onClick={() => onPageChange(page - 1)} disabled={!hasPrev}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold bg-white border border-black/[0.09] rounded-lg text-[#0D1117] hover:bg-[#F7F4EF] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronLeft size={12} /> Prev
                </button>
                {pages.map((p) => (
                    <button key={p} onClick={() => onPageChange(p)}
                        className={`w-7 h-7 text-[11px] font-semibold rounded-lg transition-all cursor-pointer border-none ${p === page ? "bg-[#4A7C59] text-white" : "bg-white border border-black/[0.09] text-[#0D1117] hover:bg-[#F7F4EF]"
                            }`}>
                        {p}
                    </button>
                ))}
                <button onClick={() => onPageChange(page + 1)} disabled={!hasNext}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold bg-white border border-black/[0.09] rounded-lg text-[#0D1117] hover:bg-[#F7F4EF] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                    Next <ChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}