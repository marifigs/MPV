/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/MPV/v2',
  assetPrefix: '/MPV/v2/',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
