import React from "react";
import Link from "next/link";
import { classNames } from "@/utils/style";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  className,
}) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return `${baseUrl}?page=${page}`;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // Logic to show a limited number of page buttons with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start/end to keep a consistent number of buttons if possible
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      className={classNames(
        "flex items-center justify-center space-x-1 py-8",
        className
      )}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {isFirstPage ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-300 cursor-not-allowed">
          <ArrowLeftIcon className="h-5 w-5" />
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
          aria-label="Previous Page"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-slate-400 select-none"
              >
                &hellip;
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all duration-200",
                isCurrent
                  ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-100"
                  : "border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500"
              )}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {isLastPage ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-300 cursor-not-allowed">
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
          aria-label="Next Page"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      )}
    </nav>
  );
};
