"use client";

import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { CarrotDownIcon } from "@/components/icons/CarrotDownIcon/CarrotDownIcon";
import { MenuIcon } from "@/components/icons/MenuIcon/MenuIcon";
import { siteMetadata } from "@/constants/siteMetadata";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import Link from "next/link";

export const NavBar = () => {
  const { scrollY } = useScrollPosition();
  const screenSize = useScreenSize();

  const transitionProgress = (scrollY / (screenSize.height || 1)) * 1.5 - 0.75;
  const paddingY = clamp(8, 12, 4 * transitionProgress + 8);
  const logoSize = clamp(36, 50, interpolate(50, 36, transitionProgress));
  const linkFontSize = clamp(13, 16, interpolate(16, 13, transitionProgress));
  const headerFontSize = clamp(24, 28, interpolate(28, 24, transitionProgress));
  return (
    <nav className="border-gray-200 fixed z-10 w-screen group">
      <div
        aria-label="nav bar main"
        className="px-4"
        style={{
          background: `rgba(255, 255, 255, ${clamp(0, 1, transitionProgress)})`,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link
            href={siteMetadata.siteUrl}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div className="flex flex-row gap-x-2 justify-start items-center">
              <PersonalLogo
                className="aspect-square"
                width={logoSize}
                height={logoSize}
              />
              <p
                style={{
                  fontSize: headerFontSize,
                  opacity: clamp(0, 1, transitionProgress),
                }}
              >
                Kevin Hou
              </p>
            </div>
          </Link>
          <button
            data-collapse-toggle="mega-menu-full"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mega-menu-full"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon />
          </button>
          <div
            id="mega-menu-full"
            className="items-center justify-between font-medium hidden w-full md:flex md:w-auto md:order-1"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  style={{ fontSize: linkFontSize }}
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <button
                  id="mega-menu-full-dropdown-button"
                  data-collapse-toggle="mega-menu-full-dropdown"
                  className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Portfolio <CarrotDownIcon className="w-2.5 h-2.5 ms-2.5" />
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        aria-label="nav bar dropdown"
        id="mega-menu-full-dropdown"
        className="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y dark:bg-gray-800 dark:border-gray-600 hidden group-hover:block"
      >
        <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
          <ul>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Online Stores</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Segmentation</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Marketing CRM</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Online Stores</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Segmentation</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="font-semibold">Marketing CRM</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
