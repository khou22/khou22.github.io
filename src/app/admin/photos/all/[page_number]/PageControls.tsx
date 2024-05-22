import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";

type PageControlsProps = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
};

export const PageControls: React.FC<PageControlsProps> = ({
  page: currentPage,
  itemsPerPage,
  totalItems,
}) => {
  const pageSelectNodes = Array.from(
    { length: Math.ceil(totalItems / itemsPerPage) },
    (_, i) => i + 1,
  ).map((page) => (
    <Link
      key={page}
      href={PAGES.ADMIN.ALL_PHOTOS(page)}
      aria-current="page"
      className={classNames(
        "relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        page === currentPage
          ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0",
      )}
    >
      {page}
    </Link>
  ));

  return (
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{currentPage * itemsPerPage + 1}</span>{" "}
          to{" "}
          <span className="font-medium">
            {currentPage * itemsPerPage + itemsPerPage}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <Link
            href={PAGES.ADMIN.ALL_PHOTOS(currentPage - 1)}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>

          {pageSelectNodes}

          <Link
            href={PAGES.ADMIN.ALL_PHOTOS(currentPage + 1)}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
};
