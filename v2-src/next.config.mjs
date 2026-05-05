/** @type {import('next').NextConfig} */
const isVercel = !!process.env.VERCEL;

const nextConfig = {
  // Static export only for GitHub Pages; Vercel runs SSR (needed for API routes)
  ...(isVercel ? {} : { output: 'export' }),
  basePath: isVercel ? '' : '/MPV/v2',
  assetPrefix: isVercel ? '' : '/MPV/v2/',
  trailingSlash: true,
  images: { unoptimized: !isVercel },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ASSET_BASE: isVercel ? '' : '/MPV/v2',
  },
};

export default nextConfig;
