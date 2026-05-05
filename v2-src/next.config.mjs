/** @type {import('next').NextConfig} */
const isVercel = !!process.env.VERCEL;

const nextConfig = {
  output: 'export',
  basePath: isVercel ? '' : '/MPV/v2',
  assetPrefix: isVercel ? '' : '/MPV/v2/',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ASSET_BASE: isVercel ? '' : '/MPV/v2',
  },
};

export default nextConfig;
