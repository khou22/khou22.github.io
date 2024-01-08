const {
  withHydrationOverlay,
} = require("@builder.io/react-hydration-overlay/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
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

let exportedConfig = nextConfig;
if (process.env.NODE_ENV !== "production") {
  exportedConfig = withHydrationOverlay({
    appRootSelector: "body",
  })(nextConfig);
}
module.exports = exportedConfig;
