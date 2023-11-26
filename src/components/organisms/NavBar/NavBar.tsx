"use client";

import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { CarrotDownIcon } from "@/components/icons/CarrotDownIcon/CarrotDownIcon";
import { MenuIcon } from "@/components/icons/MenuIcon/MenuIcon";
import { siteMetadata } from "@/constants/siteMetadata";
import { useScreenSize } from "@/hooks/useScreenSize/useScreenSize";
import { useScrollPosition } from "@/hooks/useScrollPosition/useScrollPosition";
import { clamp, interpolate } from "@/utils/math";
import { classNames } from "@/utils/style";
import Link from "next/link";
import { useState } from "react";

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
      className="border-gray-200 fixed z-20 w-screen"
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
            "absolute -z-10 h-full w-full duration-500 transition-colors ease-in-out",
            isHovering ? "bg-white/100" : "bg-white/0"
          )}
        />

        <div
          className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4"
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
            <div className="flex flex-row gap-x-2 justify-start items-center">
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
                    "absolute top-0 left-0 transition-opacity ease-in-out duration-500",
                    isHovering ? "opacity-100" : "opacity-0"
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
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
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
                  className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0"
                  style={{ fontSize: linkFontSize }}
                >
                  Portfolio <CarrotDownIcon className="w-2.5 h-2.5 ms-2.5" />
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  style={{ fontSize: linkFontSize }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  style={{ fontSize: linkFontSize }}
                >
                  Photo Store
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
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
          "border-gray-200 shadow-sm bg-white border-y",

          // Opacity and mouse events are determined by hover.
          isHovering
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",

          // Change the height (via max-height) so that it does not interfere with content on the screen.
          isHovering ? "max-h-screen" : "max-h-0"
        )}
        style={{
          // Animation setup.
          transition: `max-height 0.5s ${
            // The height should not actively animate to favor the fade. It should simply be present for the duration of the animation.
            isHovering ? "step-start" : "step-end"
          }, opacity 0.5s ease-in-out`,
        }}
      >
        <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:px-6">
          <ul>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Online Stores</div>
                <span className="text-sm">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Segmentation</div>
                <span className="text-sm text-gray-500">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Marketing CRM</div>
                <span className="text-sm text-gray-500">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Online Stores</div>
                <span className="text-sm text-gray-500">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Segmentation</div>
                <span className="text-sm text-gray-500">
                  Connect with third-party tools that you are already using.
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-100">
                <div className="font-semibold">Marketing CRM</div>
                <span className="text-sm text-gray-500">
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
