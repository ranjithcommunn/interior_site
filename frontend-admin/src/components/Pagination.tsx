import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Show up to 5 page numbers centered around the current page
  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-1.5 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} />
      </button>

      {start > 1 && <span className="text-gray-400 text-sm px-1">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-sm transition-colors ${
            p === page ? "bg-black text-white" : "bg-white border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="text-gray-400 text-sm px-1">…</span>}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};
