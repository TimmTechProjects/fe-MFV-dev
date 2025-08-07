import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  maxVisiblePages = 5,
}: PaginationProps) => {
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

  const createPageLink = (page: number) => `?page=${page}`;

  return (
    <nav className="flex justify-center items-center mt-8 select-none">
      <ul className="inline-flex items-center gap-1 bg-[#1b1b1b] px-3 py-2 rounded-xl border border-[#333] shadow-sm">
        {/* Previous */}
        <li>
          <Link
            href={createPageLink(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage === 1}
            aria-label="Previous Page"
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border transition-all duration-150 mr-4 ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 border-gray-700 pointer-events-none"
                : "bg-[#1b1b1b] text-[#81a308] border-[#444] hover:bg-[#252525] hover:text-[#a6e22e]"
            }`}
          >
            <IconChevronLeft size={16} stroke={2} />
          </Link>
        </li>

        {/* First + Ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <Link
                href={createPageLink(1)}
                className="w-8 h-8 text-sm rounded-md border border-[#444] bg-[#1b1b1b] text-white hover:bg-[#252525] transition-all"
              >
                1
              </Link>
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
            <Link
              href={createPageLink(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`w-8 h-8 text-sm rounded-md border transition-all duration-150 mx-1 text-center leading-8 block ${
                page === currentPage
                  ? "bg-[#81a308] text-white border-[#81a308] font-semibold shadow-sm"
                  : "bg-[#1b1b1b] text-white border-[#444] hover:bg-[#252525] hover:text-[#a6e22e]"
              }`}
            >
              {page}
            </Link>
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
              <Link
                href={createPageLink(totalPages)}
                className="w-8 h-8 text-sm rounded-md border border-[#444] bg-[#1b1b1b] text-white hover:bg-[#252525] transition-all text-center leading-8 block"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {/* Next */}
        <li>
          <Link
            href={createPageLink(Math.min(currentPage + 1, totalPages))}
            aria-disabled={currentPage === totalPages}
            aria-label="Next Page"
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border transition-all duration-150 ml-4 ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500 border-gray-700 pointer-events-none"
                : "bg-[#1b1b1b] text-[#81a308] border-[#444] hover:bg-[#252525] hover:text-[#a6e22e]"
            }`}
          >
            <IconChevronRight size={16} stroke={2} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
