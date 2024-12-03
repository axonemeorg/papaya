const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(env);

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
