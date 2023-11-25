import { ParallaxCover } from "@/components/ParallaxCover/ParallaxCover";
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

      <div className="h-screen bg-white relative">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="col-span-1">
            <div className="sm:p-20 p-4">
              <h1 className="text-3xl">Kevin Hou</h1>
              <p className="italic leading-loose">
                Student. Builder. Engineer.
              </p>
              <p className="text-sm">
                A full stack engineer by trade and a creator by heart. Enjoys
                the process of creation whether it be in the physical —
                woodshop, blacksmithing, circuity — or the digital — software
                engineering, photography, and film.
              </p>
              <p className="text-sm">
                Currently studying computer science at Princeton University with
                certificates in entrepreneurship and statistics and machine
                learning.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <img
              alt="homepage photography image tiles"
              src={getCdnAsset("media/landing/image_tiles_png")}
              className="sm:mt-[-15vh] w-[90%] mb-10 mt-0"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
