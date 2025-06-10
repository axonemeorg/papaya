const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(env);

/** @type {import('next').NextConfig} */
const nextConfig = {
  //
};

module.exports = nextConfig;
