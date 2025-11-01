import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCyclingRoute } from "@/utils/cycling/routeData";
import { getCdnAsset, getPhotoName, getPhotoThumbnail, PhotoIdType } from "@/utils/cdn/cdnAssets";
import { GpxRouteSvg } from "@/components/organisms/GpxRouteSvg/GpxRouteSvg";
import { parseGpxXml } from "@/utils/mapping/parseGpxXml";

// TODO: Once DOMParser is SSR compatible, can remove this layer of client rendering.
const NiceMonacoRidePageClient = dynamic(() => import('./NiceMonacoRidePageClient').then(m => m.NiceMonacoRidePageClient), { ssr: false })

const featuredImages: PhotoIdType[] = [
  'photography/san_francisco/Gravel_Bike_at_Golden_Gate_Bridge_at_Sunset_jpg',
  'photography/cycling/Peugeot_Road_Bike_at_Sunset_jpg',
  'photography/cycling/Cycling_Motion_Blur_Landscape_jpg',
]

/**
 * Nice to Monaco cycling route viewer.
 * Upload a GPX file or paste a URL to visualize the route.
 */
const NiceMonacoRidePage = async () => {
  const gpxFile = await getCyclingRoute('2025-08-nice-to-monaco.gpx')
  const { geo: geoJson } = parseGpxXml(gpxFile)

  return (
    <>
      <div
        className="w-full overflow-hidden h-screen pt-36"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${getCdnAsset(featuredImages[0])})`
        }}
      >
        <PageWrapper maxWidth="extra-wide">
          <div className="w-full flex flex-row justify-between items-start">
            <div>
              <h1 className="text-9xl bg-yellow-500 w-fit font-heading font-bold">Nissa</h1>
              <h2 className="text-9xl font-heading font-bold">Cote D&apos;Ezé</h2>
              <p className="my-4 max-w-xl">A beautiful ride through the French Riviera from Nicé to Monaco. Experience Ezé, the famous Monte Carlo Casino, and stunning views of the Mediterranian.</p>

              <GpxRouteSvg geoJson={geoJson} className="w-[500px] stroke-white stroke-[4px]" />
            </div>

            <div className="flex flex-row space-x-2 items-center justify-end">
              {featuredImages.map((photoID) => (
                <div className="w-24 h-24 bg-red-500 overflow-hidden relative" key={photoID}>
                  <Image
                    alt={getPhotoName(photoID)}
                    fill
                    src={getCdnAsset(getPhotoThumbnail(photoID) || photoID)}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
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