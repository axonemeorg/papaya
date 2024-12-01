/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: `${process.env.NEXT_PUBLIC_REMOTE_DB_PROXY_PATH}/:any*`,
        destination: `${process.env.COUCHDB_URL}/:any`,
      },
    ];
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
