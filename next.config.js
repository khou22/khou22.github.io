const {
  withHydrationOverlay,
} = require("@builder.io/react-hydration-overlay/next");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/page/1",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "c1.staticflickr.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const bundledConfig = withBundleAnalyzer(nextConfig);
let exportedConfig = bundledConfig;
if (process.env.NODE_ENV !== "production") {
  exportedConfig = withHydrationOverlay({
    appRootSelector: "body",
  })(bundledConfig);
}
module.exports = exportedConfig;
