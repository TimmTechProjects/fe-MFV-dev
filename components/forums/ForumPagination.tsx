"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ForumPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const ForumPagination: React.FC<ForumPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center select-none">
      <ul className="inline-flex items-center gap-1 bg-[#1a1d2d] px-3 py-2 rounded-lg border border-[#2c2f38]">
        {/* Previous */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="w-8 h-8 flex items-center justify-center rounded-md text-sm border transition-all mr-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#1a1d2d] text-green-400 border-[#2c2f38] hover:bg-[#22254a] disabled:hover:bg-[#1a1d2d]"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {/* First + Ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="w-8 h-8 text-sm rounded-md border border-[#2c2f38] bg-[#1a1d2d] text-white hover:bg-[#22254a] transition-all"
              >
                1
              </button>
            </li>
            {pageNumbers[0] > 2 && (
              <li>
                <span className="px-1 text-gray-500 text-sm">...</span>
              </li>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`w-8 h-8 text-sm rounded-md border transition-all mx-1 ${
                page === currentPage
                  ? "bg-green-600 text-white border-green-600 font-semibold"
                  : "bg-[#1a1d2d] text-white border-[#2c2f38] hover:bg-[#22254a]"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Last + Ellipsis */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <li>
                <span className="px-1 text-gray-500 text-sm">...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 text-sm rounded-md border border-[#2c2f38] bg-[#1a1d2d] text-white hover:bg-[#22254a] transition-all"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="w-8 h-8 flex items-center justify-center rounded-md text-sm border transition-all ml-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#1a1d2d] text-green-400 border-[#2c2f38] hover:bg-[#22254a] disabled:hover:bg-[#1a1d2d]"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
