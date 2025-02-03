const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { execSync } = require("child_process");

function getCommitHash() {
  return execSync("git rev-parse HEAD").toString().trim();
}

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
  },
  env: {
    NEXT_PUBLIC_COMMIT_HASH: getCommitHash(),
  },
};

module.exports = nextConfig;
