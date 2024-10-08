"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PortfolioDropdown } from "./PortfolioDropdown";
import { NavBarDropdownType } from "./types";
import { PhotographyDropdown } from "./PhotographyDropdown";
import { MobileNav } from "./MobileNav";
import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { CarrotDownIcon } from "@/components/icons/CarrotDownIcon/CarrotDownIcon";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import { PAGES } from "@/utils/pages";
import { classNames } from "@/utils/style";
import { useIsClient } from "@/hooks/useIsClient/useIsClient";

/**
 * Standard nav bar for the site. Floats on certain pages, otherwise is relative. Dropdowns for
 * items with additional content.
 */
export const NavBar: React.FC = () => {
  const isClient = useIsClient();

  const { scrollY } = useScrollPosition();
  const screenSize = useScreenSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState<NavBarDropdownType>();
  const isHovering = Boolean(isDropdownOpen);
  const pathname = usePathname();
  const isFloating =
    pathname === PAGES.HOME ||
    pathname === PAGES.BLOG ||
    pathname === PAGES.PHOTOGRAPHY.AERIAL_SF ||
    pathname === PAGES.BROWSER_HOMEPAGE;

  // If floating, never have a scroll transition.
  const transitionProgress = isFloating
    ? (scrollY / (screenSize.height || 1)) * 1.5 - 0.75
    : 1;

  const paddingY = clamp(8, 12, 4 * transitionProgress + 8);
  const logoSize = clamp(36, 50, interpolate(50, 36, transitionProgress));
  const linkFontSize = clamp(13, 16, interpolate(16, 13, transitionProgress));
  const headerFontSize = clamp(24, 28, interpolate(28, 24, transitionProgress));

  return (
    <nav
      className={classNames(
        "w-screen",
        isFloating
          ? "fixed left-0 top-0 z-20"
          : `${
              // Make sure there is no layout shift when the component gets executed on the client.
              // If we want to make this relative, simply change "sticky" to "relative"
              isClient ? "relative" : "sticky"
            } left-0 top-0 z-20 border-b border-gray-100`,
      )}
      onMouseLeave={() => setIsDropdownOpen(undefined)}
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
            isHovering ? "bg-white/75 backdrop-blur-sm" : "bg-white/0",
          )}
        />

        <div
          className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4"
          style={{
            paddingTop: paddingY,
            paddingBottom: paddingY,
          }}
        >
          <Link
            href={PAGES.HOME}
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
                  className="font-light"
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
                    "font-light",
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
          <MobileNav />
          <div
            id="mega-menu-full"
            className="hidden w-full items-center justify-between font-medium md:order-1 md:flex md:w-auto"
          >
            <ul className="mt-4 flex flex-col rounded-lg border p-4 rtl:space-x-reverse md:mt-0 md:flex-row md:space-x-10 md:border-0 md:p-0">
              <li>
                <Link
                  href={PAGES.HOME}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-600"
                  style={{ fontSize: linkFontSize }}
                  onMouseEnter={() => setIsDropdownOpen(undefined)}
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  className={classNames(
                    "flex w-full cursor-default items-center justify-between rounded px-3 py-2 hover:bg-gray-100 md:w-auto md:border-0 md:p-0 md:hover:bg-transparent",
                    isDropdownOpen === "portfolio"
                      ? "text-blue-500"
                      : "text-gray-900",
                  )}
                  style={{ fontSize: linkFontSize }}
                  onMouseEnter={() => setIsDropdownOpen("portfolio")}
                  onClick={() => setIsDropdownOpen("portfolio")}
                >
                  Portfolio <CarrotDownIcon className="ms-2.5 h-2.5 w-2.5" />
                </button>
              </li>
              <li>
                <Link
                  href={PAGES.BLOG}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-600"
                  style={{ fontSize: linkFontSize }}
                  onMouseEnter={() => setIsDropdownOpen(undefined)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.PHOTOGRAPHY.HOME}
                  className={classNames(
                    "flex w-full items-center justify-between rounded px-3 py-2 hover:bg-gray-100 md:w-auto md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-600",
                    isDropdownOpen === "photography"
                      ? "text-blue-500"
                      : "text-gray-900",
                  )}
                  style={{ fontSize: linkFontSize }}
                  onMouseEnter={() => setIsDropdownOpen("photography")}
                >
                  Photography <CarrotDownIcon className="ms-2.5 h-2.5 w-2.5" />
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.CONTACT}
                  className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-600"
                  style={{ fontSize: linkFontSize }}
                  onMouseEnter={() => setIsDropdownOpen(undefined)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        aria-label="nav bar dropdown"
        id="mega-menu-full-dropdown"
        className={classNames(
          "border-y border-gray-200 bg-white/75 shadow-sm backdrop-blur-sm",
          "absolute left-0 top-full z-20 w-full",

          // Opacity and mouse events are determined by hover.
          isHovering
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        style={{
          // Animation setup.
          transition: `max-height 0.5s ${
            // The height should not actively animate to favor the fade. It should simply be present for the duration of the animation.
            isHovering ? "step-start" : "step-end"
          }, opacity 0.5s ease-in-out`,
        }}
      >
        {isDropdownOpen === "portfolio" && <PortfolioDropdown />}
        {isDropdownOpen === "photography" && <PhotographyDropdown />}
      </div>
    </nav>
  );
};
