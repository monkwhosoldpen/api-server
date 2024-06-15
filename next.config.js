/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ROOT: __dirname,
  },
};

module.exports = nextConfig;
