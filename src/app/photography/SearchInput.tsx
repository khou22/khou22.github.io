"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { classNames } from "@/utils/style";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";

type SearchInputProps = {
  initialQuery?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  return (
    <div className="relative flex w-full flex-row items-center justify-center bg-gradient-to-b from-gray-100/10 to-gray-50 pb-4 pt-8">
      <form action="/photography/search">
        <div
          className={classNames(
            "group flex w-[95vw] max-w-lg flex-row items-center justify-center rounded-lg border border-gray-100 bg-white px-4 py-2 shadow",
            "focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500/75",
            "hover:ring-2 hover:ring-inset hover:ring-blue-500/75",
          )}
        >
          <MagnifyingGlassIcon className="h-6 w-6 shrink-0 opacity-100 transition-opacity duration-200 group-focus-within:opacity-0 group-hover:opacity-0" />
          <input
            placeholder="Search photos..."
            defaultValue={initialQuery}
            required
            minLength={3}
            type="text"
            name="query"
            className="grow border-0 focus:ring-0 focus:ring-offset-0"
          />
          <button
            type="submit"
            className="pointer-events-none cursor-pointer border-none bg-none group-focus-within:pointer-events-auto"
          >
            <ArrowRightIcon className="h-6 w-6 shrink-0 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100" />
          </button>
        </div>
      </form>
    </div>
  );
};
