import React from "react";
import { NiceMonacoRidePageClient } from "./NiceMonacoRidePageClient";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

/**
 * Nice to Monaco cycling route viewer.
 * Upload a GPX file or paste a URL to visualize the route.
 */
export default function NiceMonacoRidePage() {
  return (
    <PageWrapper>
      <div className="mb-4 w-full border-b border-gray-300 pb-4 text-center">
        <h1 className="text-3xl font-semibold leading-loose tracking-tight md:text-4xl">
          Nice to Monaco
        </h1>
        <p className="text-neutral-600">
          Cycling Route Viewer • Upload a GPX file or paste a URL
        </p>
      </div>

      <NiceMonacoRidePageClient />

      <p className="mt-3 text-xs text-neutral-500">
        Tiles © OpenStreetMap contributors • Carto Light basemap. For heavier
        usage, self-host or switch to another free OSM provider.
      </p>
    </PageWrapper>
  );
}
