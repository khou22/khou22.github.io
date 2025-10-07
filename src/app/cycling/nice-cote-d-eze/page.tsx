import React from "react";
import dynamic from "next/dynamic";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { getCyclingRoute } from "@/utils/cycling/routeData";

// TODO: Once DOMParser is SSR compatible, can remove this layer of client rendering.
const NiceMonacoRidePageClient = dynamic(() => import('./NiceMonacoRidePageClient').then(m => m.NiceMonacoRidePageClient), { ssr: false })

/**
 * Nice to Monaco cycling route viewer.
 * Upload a GPX file or paste a URL to visualize the route.
 */
const NiceMonacoRidePage = async () => {
  const gpxFile = await getCyclingRoute('2025-08-nice-to-monaco.gpx')

  return (
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
  );
}

export default NiceMonacoRidePage;