import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import Image from "next/image";
import Link from "next/link";

const PhotographyHomepage = async () => {
  return (
    <PageWrapper maxWidth="none">
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 xl:grid-cols-4">
        <Link
          href={PAGES.PHOTOGRAPHY.AERIAL}
          className="group col-span-1 sm:col-span-2"
        >
          <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded shadow">
            <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center space-y-4 text-white">
              <h3>San Francisco by Air</h3>
              <span className="w-12 border-b-2 border-white" />
              <p>An aerial photo series of San Francisco.</p>
            </div>
            <Image
              src={getCdnAsset(
                "photography/Embarcadero_Aerial_View_at_Sunset_jpg",
              )}
              alt="Embarcadero Aerial View at Sunset"
              className="object-cover brightness-100 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75"
              fill
            />
          </div>
        </Link>
        <Link href={PAGES.PHOTOGRAPHY.FEATURED} className="group col-span-1">
          <div className="flex h-full flex-col justify-evenly overflow-clip rounded bg-blue-800 shadow">
            <div className="relative aspect-square w-full">
              <Image
                src={getCdnAsset(
                  "photography/Pigeon_Point_Lighthouse_Milky_Way_jpg",
                )}
                alt="Embarcadero Aerial View at Sunset"
                className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
                fill
              />
            </div>
            <div className="flex h-1/2 w-full flex-col items-center justify-center space-y-4 px-2 py-4 text-white sm:py-8">
              <p className="text-sm text-gray-400">Collection</p>
              <h5>Astrophotography</h5>
              <span className="w-6 border-b border-white" />
              <p className="text-center text-sm">
                Undoubtably one of my favorite and most technically complex
                forms of photography.
              </p>
            </div>
          </div>
        </Link>
        <Link href={PAGES.PHOTOGRAPHY.FEATURED} className="group col-span-1">
          <div className="relative flex h-full flex-col justify-evenly overflow-clip rounded bg-blue-800 shadow">
            <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center space-y-4 text-white">
              <p>Travel</p>
              <h3>Tokyo, Japan</h3>
              <span className="w-6 border-b border-white" />
              <p>Capturing the beauties of Japan.</p>
            </div>
            <Image
              src={getCdnAsset("photography/Hie_Shrine_Tokyo_Japan_jpg")}
              alt="Embarcadero Aerial View at Sunset"
              className="object-cover brightness-100 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75"
              fill
            />
          </div>
        </Link>
      </div>
    </PageWrapper>
  );
};

export default PhotographyHomepage;
