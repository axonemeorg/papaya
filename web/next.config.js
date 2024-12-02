/** @type {import('next').NextConfig} */
const nextConfig = {
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
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  }
};

module.exports = nextConfig;
