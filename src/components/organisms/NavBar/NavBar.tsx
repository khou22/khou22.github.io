"use client";

import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { CarrotDownIcon } from "@/components/icons/CarrotDownIcon/CarrotDownIcon";
import { MenuIcon } from "@/components/icons/MenuIcon/MenuIcon";
import { siteMetadata } from "@/constants/siteMetadata";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import Link from "next/link";
import { useState } from "react";
import { PortfolioDropdown } from "./PortfolioDropdown";

export const NavBar = () => {
  const { scrollY } = useScrollPosition();
  const screenSize = useScreenSize();
  const [isHovering, setIsHovering] = useState(false);

  const transitionProgress = (scrollY / (screenSize.height || 1)) * 1.5 - 0.75;
  const paddingY = clamp(8, 12, 4 * transitionProgress + 8);
  const logoSize = clamp(36, 50, interpolate(50, 36, transitionProgress));
  const linkFontSize = clamp(13, 16, interpolate(16, 13, transitionProgress));
  const headerFontSize = clamp(24, 28, interpolate(28, 24, transitionProgress));

  return (
    <nav
      className="fixed z-20 w-screen border-gray-200"
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        aria-label="nav bar main"
        style={{
          // Scroll background color (this is lower priority than the hovering background color)
          background: `rgba(255, 255, 255, ${clamp(0, 1, transitionProgress)})`,
        }}
      >
        {/* Background of the main content for hovering background */}
        <div
          className={classNames(
            "absolute -z-10 h-full w-full transition-colors duration-500 ease-in-out",
            isHovering ? "bg-white/80 backdrop-blur" : "bg-white/0",
          )}
        />

        <div
          className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4"
          style={{
            paddingTop: paddingY,
            paddingBottom: paddingY,
          }}
          onMouseEnter={() => setIsHovering(true)}
        >
          <Link
            href={siteMetadata.siteUrl}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div className="flex flex-row items-center justify-start gap-x-2">
              <PersonalLogo
                className="aspect-square"
                width={logoSize}
                height={logoSize}
              />

              {/* Kevin Hou name has two identical paragraph tags on top of each other.
              One's opacity is controlled by the scroll, and the other is controlled by the hovering.
              This enables smooth transitions for both. */}
              <div className="relative">
                <p
                  aria-label="kevin hou (controlled by scroll)"
                  style={{
                    fontSize: headerFontSize,
                    opacity: clamp(0, 1, transitionProgress),
                  }}
                >
                  Kevin Hou
                </p>
                <p
                  aria-label="kevin hou (controlled by hover)"
                  className={classNames(
                    "absolute left-0 top-0 transition-opacity duration-500 ease-in-out",
                    isHovering ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    fontSize: headerFontSize,
                  }}
                >
                  Kevin Hou
                </p>
              </div>
            </div>
          </Link>
          <button
            data-collapse-toggle="mega-menu-full"
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
            aria-controls="mega-menu-full"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon />
          </button>
          <div
            id="mega-menu-full"
            className="hidden w-full items-center justify-between font-medium md:order-1 md:flex md:w-auto"
          >
            <ul className="mt-4 flex flex-col rounded-lg border p-4 rtl:space-x-reverse md:mt-0 md:flex-row md:space-x-10 md:border-0 md:p-0">
              <li>
                <Link
                  href={PAGES.HOME}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                  style={{ fontSize: linkFontSize }}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  id="mega-menu-full-dropdown-button"
                  data-collapse-toggle="mega-menu-full-dropdown"
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:w-auto md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-600"
                  style={{ fontSize: linkFontSize }}
                >
                  Portfolio <CarrotDownIcon className="ms-2.5 h-2.5 w-2.5" />
                </button>
              </li>
              <li>
                <Link
                  href={PAGES.BLOG}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                  style={{ fontSize: linkFontSize }}
                >
                  Print Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
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
        className={classNames(
          "border-y border-gray-200 bg-white/20 shadow-sm",

          // Opacity and mouse events are determined by hover.
          isHovering
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",

          // Change the height (via max-height) so that it does not interfere with content on the screen.
          isHovering ? "max-h-screen" : "max-h-0",
        )}
        style={{
          // Animation setup.
          transition: `max-height 0.5s ${
            // The height should not actively animate to favor the fade. It should simply be present for the duration of the animation.
            isHovering ? "step-start" : "step-end"
          }, opacity 0.5s ease-in-out`,
        }}
      >
        <PortfolioDropdown />
      </div>
    </nav>
  );
};
