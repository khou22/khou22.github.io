import { CustomLink } from "@/components/atoms/CustomLink/CustomLink";
import { FadeInView } from "@/components/atoms/FadeInView/FadeInView";
import { ParallaxCover } from "@/components/organisms/ParallaxCover/ParallaxCover";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export default function Home() {
  return (
    <main>
      <ParallaxCover />

      {/* Gradient transition to the page content. */}
      <div className="relative">
        <div className="absolute top-[-10vh] h-[10vh] w-full bg-gradient-to-b from-black/0 to-black/100 sm:top-[-20vh] sm:h-[20vh]">
          <img
            alt="scroll down arrow"
            id="scroll-down-arrow"
            className="absolute left-1/2 top-[140%] z-10 w-5 translate-x-[-50%] animate-bounce"
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
              <p className="italic leading-relaxed">Always building</p>
              <p className="my-2 text-sm">
                A full stack engineer by trade and a creator by heart. Enjoys
                the process of creation whether it be in the physical (woodshop,
                blacksmithing, circuity) or the digital (software engineering,
                photography, and film).
              </p>
              <p className="text-sm">
                Currently building AI-powered dev tools at{" "}
                <CustomLink
                  href="https://codeium.com?referrer=khou22.com"
                  target="_blank"
                >
                  Codeium
                </CustomLink>{" "}
                (Exafunction). Previously a tech lead manager at{" "}
                <CustomLink href="https://www.nuro.ai" target="_blank">
                  Nuro
                </CustomLink>{" "}
                self-driving. Received a computer science engineering degree
                from Princeton University with certificates in entrepreneurship
                and statistics and machine learning.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <FadeInView>
              <img
                alt="homepage photography image tiles"
                src={getCdnAsset("media/landing/image_tiles_png")}
                className="mb-10 mt-0 w-[90%] sm:mt-[-15vh]"
              />
            </FadeInView>
          </div>
        </div>

        <div className="h-screen w-full bg-black" />
      </div>
    </main>
  );
}
