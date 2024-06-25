import React from "react";
import { InstagramIcon } from "@/components/icons/InstagramIcon/InstagramIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon/LinkedInIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon/TwitterIcon";
import { siteMetadata } from "@/constants/siteMetadata";
import { classNames } from "@/utils/style";
import { GitHubIcon } from "@/components/icons/GitHubIcon/GitHubIcon";

const socials = [
  {
    name: "Instagram",
    href: siteMetadata.socials.instagram,
    icon: InstagramIcon,
    className: "hover:text-[#C13584]",
    showColorsClassName: "text-[#C13584] hover:opacity-90",
  },
  {
    name: "LinkedIn",
    href: siteMetadata.socials.linkedin,
    icon: LinkedInIcon,
    className: "hover:text-[#0072b1]",
    showColorsClassName: "text-[#0072b1] hover:opacity-90",
  },
  {
    name: "Twitter",
    href: siteMetadata.socials.twitter,
    icon: TwitterIcon,
    className: "hover:text-[#1DA1F2]",
    showColorsClassName: "text-[#1DA1F2] hover:opacity-90",
  },
  {
    name: "GitHub",
    href: siteMetadata.socials.github,
    icon: GitHubIcon,
    className: "hover:text-black",
    showColorsClassName: "text-black hover:opacity-90",
  },
];

type SocialLinksProps = {
  className?: string;
  showColors?: boolean;
  size?: "md" | "lg";
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = "",
  showColors = false,
  size = "md",
}) => {
  return (
    <div className={classNames("flex flex-row items-center", className)}>
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          className={classNames(
            "cursor-pointer transition-colors duration-300 ease-in-out",
            showColors
              ? item.showColorsClassName
              : `${item.className} text-gray-400`,
          )}
        >
          <span className="sr-only">{item.name}</span>
          <item.icon
            className={size === "lg" ? "h-8 w-8" : "h-6 w-6"}
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
};
