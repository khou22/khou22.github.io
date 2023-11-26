import { InstagramIcon } from "@/components/icons/InstagramIcon/InstagramIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon/LinkedInIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon/TwitterIcon";
import { YouTubeIcon } from "@/components/icons/YouTubeIcon/YouTubeIcon";
import { siteMetadata } from "@/constants/siteMetadata";

const navigation = [
  {
    name: "Instagram",
    href: siteMetadata.socials.instagram,
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: siteMetadata.socials.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: "Twitter",
    href: siteMetadata.socials.twitter,
    icon: TwitterIcon,
  },
  {
    name: "YouTube",
    href: siteMetadata.socials.youtube,
    icon: YouTubeIcon,
  },
];

const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="text-gray-400 hover:text-gray-600 duration-300 transition-colors ease-in-out cursor-pointer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {year} {siteMetadata.author}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
