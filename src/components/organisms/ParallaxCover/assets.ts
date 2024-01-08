/**
 * An attempt to generate asset URLs on the server so that we don't ship the entire CDN assets
 * mapping to client. This is not proved to work because I imagine the CDN assets are getting
 * shipped elsewhere.
 *
 * TODO (kevin): Look more into this.
 */

import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export const initialsLogoAssetURL = getCdnAsset(
  "media/site/logo/initials_logo_animated_svg",
);
export const cloudsAssetURL = getCdnAsset("media/landing/cloud_0_png");
export const panoramaSlices = [
  {
    full: getCdnAsset("media/landing/hong_kong/large/0_png"),
    small: getCdnAsset("media/landing/hong_kong/0_png"),
  },
  {
    full: getCdnAsset("media/landing/hong_kong/large/1_png"),
    small: getCdnAsset("media/landing/hong_kong/1_png"),
  },
  {
    full: getCdnAsset("media/landing/hong_kong/large/2_png"),
    small: getCdnAsset("media/landing/hong_kong/2_png"),
  },
];
