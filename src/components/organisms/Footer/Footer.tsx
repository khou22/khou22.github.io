import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { PersonalLogo } from "@/components/atoms/PersonalLogo/PersonalLogo";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { siteMetadata } from "@/constants/siteMetadata";
import { PAGES } from "@/utils/pages";

const year = new Date().getFullYear();

const navigation = {
  portfolio: [
    { name: "Wood", href: PAGES.WOOD },
    { name: "Coding", href: PAGES.PROGRAMMING },
    { name: "Photography", href: PAGES.PHOTOGRAPHY.HOME },
    { name: "Design", href: PAGES.DESIGN },
  ],
  photography: [
    { name: "Photo Store", href: PAGES.PHOTOGRAPHY.HOME },
    { name: "Featured", href: PAGES.PHOTOGRAPHY.FEATURED },
    { name: "Aerial San Francisco", href: PAGES.PHOTOGRAPHY.AERIAL_SF },
    { name: "Browse Photos", href: PAGES.PHOTOGRAPHY.BROWSE },
  ],
  personal: [
    { name: "Blog", href: PAGES.BLOG },
    { name: "Contact", href: PAGES.CONTACT },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="space-y-8">
            <PersonalLogo className="h-7 w-7" />
            <p className="caption leading-6">
              Engineer, designer, photographer, and entrepreneur.
            </p>
            <SocialLinks className="space-x-6 md:order-2" />
          </div>
          <div className="col-span-2 mt-16 grid-cols-3 gap-8 sm:grid sm:gap-8 lg:mt-0">
            <div>
              <p className="text-sm font-bold leading-6 text-gray-600">
                Portfolio
              </p>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.portfolio.map((item) => (
                  <li key={item.name}>
                    <CustomLink
                      href={item.href}
                      className="text-sm leading-6 text-gray-400"
                    >
                      {item.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 sm:mt-0">
              <p className="text-sm font-bold leading-6 text-gray-600">
                Photography
              </p>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.photography.map((item) => (
                  <li key={item.name}>
                    <CustomLink
                      href={item.href}
                      className="text-sm leading-6 text-gray-400"
                    >
                      {item.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 sm:mt-0">
              <p className="text-sm font-bold leading-6 text-gray-600">
                Personal
              </p>
              <ul role="list" className="mt-6 space-y-3">
                {navigation.personal.map((item) => (
                  <li key={item.name}>
                    <CustomLink
                      href={item.href}
                      className="text-sm leading-6 text-gray-400"
                    >
                      {item.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
        <p className="text-xs leading-5 text-gray-500">
          &copy; {year} {siteMetadata.author}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
