const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ...require("dotenv").config({ path: path.resolve(__dirname, "../.env") }).parsed,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2pi62fso03sq4.cloudfront.net",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
