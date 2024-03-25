import Link from "next/link";
import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { ParallaxCover } from "@/components/organisms/ParallaxCover/ParallaxCover";
import { occupations } from "@/constants/occupations";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon/ArrowRightIcon";
import { Button } from "@/components/ui/button";
import { ParallaxTextBackground } from "@/components/atoms/ParallaxTextBackground/ParallaxTextBackground";
import { PhotographyCustomersGrid } from "@/components/organisms/PhotographyCustomersGrid/PhotographyCustomersGrid";
import { ParallaxHoverCard } from "@/components/atoms/ParallaxHoverCard/ParallaxHoverCard";
import { PhotoImage } from "@/components/atoms/PhotoImage/PhotoImage";
import { SocialLinks } from "@/components/molecules/SocialLinks/SocialLinks";
import { BioSection } from "@/components/organisms/BioSection/BioSection";

const HomePage = async () => {
  return (
    <main className="overflow-x-hidden">
      <ParallaxCover />

      {/* Gradient transition to the page content. */}
      <div className="relative">
        <div className="pointer-events-none absolute top-[-20vh] flex h-[20vh] w-full flex-row items-end justify-center bg-gradient-to-b from-black/0 to-black/100 pb-2">
          <img
            alt="scroll down arrow"
            id="scroll-down-arrow"
            className="w-4 animate-bounce opacity-80 md:w-5"
            src={getCdnAsset("media/site/icons/chevron_down_bw_svg")}
          />
        </div>

        <div className="h-[50px] w-full bg-black sm:h-[110px] md:h-[250px]" />
      </div>

      <div className="relative flex flex-col items-center justify-center bg-white">
        {/* Intro section. */}
        <div className="grid max-w-6xl grid-cols-1 sm:grid-cols-2">
          <div className="col-span-1">
            <div className="p-4 sm:p-20">
              <h2 className="leading-relaxed">Kevin Hou</h2>
              <p className="italic leading-relaxed">
                Always building & learning
              </p>
              <FadeInView once threshold={0.4} durationMS={1000} delayMS={100}>
                <p className="my-3 text-sm">
                  A full stack engineer by trade and a creator by heart. Enjoys
                  the process of creation whether it be in the physical
                  (woodshop, blacksmithing, circuity) or the digital (software
                  engineering, photography, and film).
                </p>
              </FadeInView>
              <FadeInView once threshold={0.4} durationMS={1000} delayMS={250}>
                <p className="text-sm">
                  Currently building AI-powered dev tools at{" "}
                  <CustomLink
                    href="https://codeium.com?referrer=khou22.com"
                    target="_blank"
                    underline
                  >
                    Codeium
                  </CustomLink>{" "}
                  (Exafunction). Previously a tech lead manager at{" "}
                  <CustomLink
                    href="https://www.nuro.ai"
                    target="_blank"
                    underline
                  >
                    Nuro
                  </CustomLink>{" "}
                  self-driving. Received a computer science engineering degree
                  from Princeton University with certificates in
                  entrepreneurship and statistics and machine learning.
                </p>
              </FadeInView>
              <FadeInView
                once
                threshold={0.4}
                durationMS={1000}
                delayMS={500}
                className="mb-2 mt-5"
              >
                <SocialLinks className="space-x-4" />
              </FadeInView>
            </div>
          </div>
          <div className="col-span-1 p-4 sm:p-0">
            <FadeInView threshold={0.35} durationMS={1000}>
              <img
                alt="homepage photography image tiles"
                src={getCdnAsset("media/landing/image_tiles_png")}
                className="mb-10 mt-0 w-[90%] sm:mt-[-15vh]"
              />
            </FadeInView>
          </div>
        </div>

        <PageWrapper maxWidth="none" className="mb-12 mt-4 md:mb-16 lg:mb-20">
          <ParallaxTextBackground
            transformYBounds={[18, 38]}
            zoomBounds={[1, 3.5]}
            parallaxWindow="screen"
            backgroundURL={`url(${getCdnAsset(
              "photography/San_Francisco_Sunset_Skyline_Landscape_from_Plane_jpg",
            )})`}
            className="3xl:text-[12rem] max-w-full break-words text-center text-[3rem] font-black xs:text-[4.5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8.5rem] xl:text-[10rem] 2xl:text-[11rem]"
          >
            Engineer, Photographer, Woodworker
          </ParallaxTextBackground>
        </PageWrapper>

        <div className="w-full bg-gray-800 py-8 text-white md:py-16 lg:py-24">
          <PageWrapper>
            <div className="mb-6 w-full text-center">
              <h2 className="mb-2 leading-relaxed">
                Building, Designing, and Shipping Software
              </h2>
              <p className="caption text-gray-200">
                Software engineering and tech lead management experience in
                Silicon Valley and New York from seed, growth, Fortune 500.
              </p>
            </div>
            <div className="my-8 flex w-full flex-row items-center justify-evenly gap-8">
              {occupations
                .filter((occupation) => occupation.featured)
                .map((occupation) => (
                  <div
                    key={occupation.company.name}
                    className="relative aspect-[7/2] w-full scale-100 transition-transform duration-200 ease-in-out hover:scale-110"
                  >
                    <img
                      src={
                        occupation.company.logoLight ?? occupation.company.logo
                      }
                      alt={occupation.company.name}
                      className="h-full w-full object-contain"
                    />
                    <span className="sr-only">{occupation.company.name}</span>
                  </div>
                ))}
            </div>

            <div className="mt-4 w-full text-center">
              <CustomLink href={PAGES.PROGRAMMING}>
                See all <ArrowRightIcon className="inline h-4 w-4" />
              </CustomLink>
            </div>
          </PageWrapper>
        </div>

        <PageWrapper maxWidth="none" className="my-12 md:my-16 lg:my-20">
          <ParallaxTextBackground
            transformYBounds={[80, 40]}
            zoomBounds={[1.4, 1]}
            parallaxWindow="screen"
            backgroundURL={`url(${getCdnAsset(
              "photography/product/IWC_Watch_Shot_Landscape_jpg",
            )})`}
            className="max-w-full break-words text-center text-[3.2rem] font-black leading-normal xs:text-[4.5rem] sm:text-[6rem] md:text-[7.1rem] lg:text-[8.8rem] xl:text-[11rem] 2xl:text-[13rem]"
          >
            Freelance Photographer
          </ParallaxTextBackground>
        </PageWrapper>

        <PageWrapper>
          <div className="mb-16 md:mb-24 lg:mb-36">
            <FadeInView once>
              <h5 className="mb-4 text-center leading-loose md:mb-6">
                Prior experience with brands including
              </h5>
            </FadeInView>
            <FadeInView once>
              <PhotographyCustomersGrid className="my-4" />
            </FadeInView>
            <FadeInView once>
              <p className="caption text-center">
                and many more across many industries
              </p>
            </FadeInView>
          </div>
        </PageWrapper>

        <BioSection className="mb-12 lg:mb-24 xl:mb-36" />

        {/* Quick links */}
        <PageWrapper maxWidth="wide" className="my-12">
          <h2 className="mb-8 w-full text-center md:mb-12">Prints Available</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            <FadeInView>
              <Link
                href={PAGES.PHOTOGRAPHY.PHOTO(
                  "photography/San_Francisco_California_and_Powell_Street_Trolly_jpg",
                )}
              >
                <ParallaxHoverCard>
                  <PhotoImage photoID="photography/San_Francisco_California_and_Powell_Street_Trolly_jpg" />
                </ParallaxHoverCard>
              </Link>
            </FadeInView>
            <FadeInView delayMS={200}>
              <Link
                href={PAGES.PHOTOGRAPHY.PHOTO(
                  "photography/Shore_Stimulations_Dominican_Republic_Top_Down_Drone_Beach_jpg",
                )}
              >
                <ParallaxHoverCard>
                  <PhotoImage photoID="photography/Shore_Stimulations_Dominican_Republic_Top_Down_Drone_Beach_jpg" />
                </ParallaxHoverCard>
              </Link>
            </FadeInView>
            <FadeInView delayMS={400}>
              <Link
                href={PAGES.PHOTOGRAPHY.PHOTO(
                  "media/store/Hie_Shrine_Tokyo_Japan_jpg",
                )}
              >
                <ParallaxHoverCard>
                  <PhotoImage photoID="photography/Hie_Shrine_Tokyo_Japan_jpg" />
                </ParallaxHoverCard>
              </Link>
            </FadeInView>
            <FadeInView className="block md:hidden" delayMS={600}>
              <Link
                href={PAGES.PHOTOGRAPHY.PHOTO(
                  "photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg",
                )}
              >
                <ParallaxHoverCard>
                  <PhotoImage photoID="photography/San_Francisco_Golden_Gate_Park_Satellite_Shot_jpg" />
                </ParallaxHoverCard>
              </Link>
            </FadeInView>
          </div>
          <div className="my-6 flex w-full flex-row items-center justify-center space-x-2 md:my-10">
            <Link href={PAGES.PHOTOGRAPHY.HOME}>
              <Button variant="primary" size="lg">
                See All
              </Button>
            </Link>
            <Link href={PAGES.PHOTOGRAPHY.FEATURED}>
              <Button variant="secondary" size="lg">
                Featured
              </Button>
            </Link>
          </div>
        </PageWrapper>
      </div>
    </main>
  );
};

export default HomePage;
