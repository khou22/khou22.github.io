import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { siteMetadata } from "@/constants/siteMetadata";

const year = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <SocialLinks className="space-x-6 md:order-2" />
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {year} {siteMetadata.author}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
