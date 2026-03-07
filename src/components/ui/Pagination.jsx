import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  totalItems = 0,
  itemsPerPage = 20
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const basePageBtn = `
    relative px-3.5 py-1.5 rounded-lg text-sm font-medium min-w-[38px]
    transition-all duration-150 select-none
  `;

  const activePageBtn = `${basePageBtn}
    bg-indigo-600 text-white shadow-md shadow-indigo-200
    ring-2 ring-indigo-300 ring-offset-1
  `;

  const inactivePageBtn = `${basePageBtn}
    bg-white text-slate-600 border border-slate-200
    hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
    hover:shadow-sm
  `;

  const navBtn = (disabled) => `
    p-2 rounded-lg border transition-all duration-150 select-none
    ${disabled
      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
      : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-sm"
    }
  `;

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6"
      style={{
        borderTop: "1px solid #e8eaf0",
      }}
    >
      {/* Info text */}
      <p
        className="text-sm mb-4 sm:mb-0 font-medium"
        style={{ color: "#94a3b8" }}
      >
        Showing{" "}
        <span style={{ color: "#475569" }}>
          {startItem}–{endItem}
        </span>{" "}
        of{" "}
        <span style={{ color: "#475569" }}>{totalItems}</span>{" "}
        files
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={navBtn(currentPage === 1 || loading)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* First page + ellipsis */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className={1 === currentPage ? activePageBtn : inactivePageBtn}
            >
              1
            </button>
            {startPage > 2 && (
              <span
                className="px-1 text-sm font-medium select-none"
                style={{ color: "#cbd5e1" }}
              >
                ···
              </span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={
              page === currentPage
                ? activePageBtn + (loading ? " opacity-50" : "")
                : inactivePageBtn + (loading ? " opacity-50" : "")
            }
          >
            {page}
          </button>
        ))}

        {/* Ellipsis + last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span
                className="px-1 text-sm font-medium select-none"
                style={{ color: "#cbd5e1" }}
              >
                ···
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className={
                totalPages === currentPage ? activePageBtn : inactivePageBtn
              }
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={navBtn(currentPage === totalPages || loading)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;