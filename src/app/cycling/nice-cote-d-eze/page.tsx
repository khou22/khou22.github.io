import React from "react";
import dynamic from "next/dynamic";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCyclingRoute } from "@/utils/cycling/routeData";
import { getCdnAsset } from "@/utils/cdn/cdnAssets";

// TODO: Once DOMParser is SSR compatible, can remove this layer of client rendering.
const NiceMonacoRidePageClient = dynamic(() => import('./NiceMonacoRidePageClient').then(m => m.NiceMonacoRidePageClient), { ssr: false })

/**
 * Nice to Monaco cycling route viewer.
 * Upload a GPX file or paste a URL to visualize the route.
 */
const NiceMonacoRidePage = async () => {
  const gpxFile = await getCyclingRoute('2025-08-nice-to-monaco.gpx')

  return (
    <>
      {/* Scratch */}
      <div className="mt-64 mb-[50vh]">

      </div>

      <div
        className="w-full overflow-hidden"
        style={{
          backgroundSize: 'cover',
          backgroundImage: `url(${getCdnAsset('photography/san_francisco/Gravel_Bike_at_Golden_Gate_Bridge_at_Sunset_jpg')})`
        }}
      >
        <PageWrapper maxWidth="wide">
          <div className="grid grid-cols-4 w-full min-h-[100vh] relative py-24">
            {/* Row 1 */}
            <div className="col-span-1">
              <h1 className="text-6xl font-bold">
                Nice to Monaco via Cote D&amp;Eze
              </h1>
            </div>
            <div className="col-span-1">
              <h4 className="text-lg font-light uppercase">
                Experience the magic of the French Riviera as it was in the Tour de France
              </h4>
            </div>
            <div className="col-span-1" />
            <div className="col-span-1 text-right">
              Nice, France
            </div>

            {/* Row 2 */}
            <div className="col-span-2">
              <h1 className="text-[200px] w-full">
                NISSA
              </h1>
            </div>
            <div className="col-span-1" />
            <div className="col-span-1">
              <div className="w-full aspect-square bg-white" />
            </div>

            {/* Column lines */}
            {[0, .25, .5, .75, 1].map((percentage, _) => (
              <div
                key={percentage}
                className="absolute -top-1/2 border-l border-white z-10 h-[200%]"
                style={{ left: `${100 * percentage}%` }} />
            ))}
          </div>
        </PageWrapper>
      </div>
    <PageWrapper>
      <div className="mb-4 w-full border-b border-gray-300 pb-4 text-center">
        <h1 className="text-3xl font-semibold leading-loose tracking-tight md:text-4xl">
          Nice to Monaco
        </h1>
        <p className="text-neutral-600">
          Cycling along the coastline of the South of France
        </p>
      </div>

      <NiceMonacoRidePageClient gpxFileContents={gpxFile} />
    </PageWrapper>
    </>
  );
}

export default NiceMonacoRidePage;