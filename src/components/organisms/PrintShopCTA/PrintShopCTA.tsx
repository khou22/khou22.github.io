import Link from "next/link";
import { PAGES } from "@/utils/pages";

interface PrintShopCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
}

export const PrintShopCTA = ({
  title,
  description,
  buttonText,
  buttonHref = PAGES.PHOTOGRAPHY.HOME,
}: PrintShopCTAProps) => {
  return (
    <div className="my-12 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white px-6 py-10 text-center dark:bg-gray-900">
        <h3 className="mb-4 text-2xl font-bold">{title}</h3>
        <p className="mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="rounded-md bg-black px-6 py-3 text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};
