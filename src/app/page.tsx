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
        <div className="h-[10vh] sm:h-[20vh] sm:top-[-20vh] w-full top-[-10vh] absolute bg-gradient-to-b from-black/0 to-black/100">
          <img
            alt="scroll down arrow"
            id="scroll-down-arrow"
            className="absolute left-1/2 translate-x-[-50%] z-10 top-[140%] w-5 animate-bounce"
            src={getCdnAsset("media/site/icons/chevron_down_bw_svg")}
          />
        </div>

        <div className="md:h-[250px] sm:h-[110px] h-[50px] w-full bg-black" />
      </div>

      <div className="bg-white relative flex flex-col justify-center items-center">
        {/* Intro section. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-6xl">
          <div className="col-span-1">
            <div className="sm:p-20 p-4">
              <h2 className="leading-relaxed">Kevin Hou</h2>
              <p className="italic leading-relaxed">Always building</p>
              <p className="text-sm my-2">
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
                className="sm:mt-[-15vh] w-[90%] mb-10 mt-0"
              />
            </FadeInView>
          </div>
        </div>

        <div className="h-screen w-full bg-black" />
      </div>
    </main>
  );
}
