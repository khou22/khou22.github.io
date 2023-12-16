import { InstagramIcon } from "@/components/icons/InstagramIcon/InstagramIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon/LinkedInIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon/TwitterIcon";
import { siteMetadata } from "@/constants/siteMetadata";
import { classNames } from "@/utils/style";
import React from "react";

// TODO: Replace with proper brand colors
const socials = [
  {
    name: "Instagram",
    href: siteMetadata.socials.instagram,
    icon: InstagramIcon,
    className: "hover:text-purple-400",
  },
  {
    name: "LinkedIn",
    href: siteMetadata.socials.linkedin,
    icon: LinkedInIcon,
    className: "hover:text-blue-500",
  },
  {
    name: "Twitter",
    href: siteMetadata.socials.twitter,
    icon: TwitterIcon,
    className: "hover:text-blue-400",
  },
];

type SocialLinksProps = {
  className?: string;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = "" }) => {
  return (
    <div className={classNames("flex justify-center", className)}>
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          className={classNames(
            "cursor-pointer text-gray-400 transition-colors duration-300 ease-in-out",
            item.className,
          )}
        >
          <span className="sr-only">{item.name}</span>
          <item.icon className="h-6 w-6" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};
