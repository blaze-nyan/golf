/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Completely ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  // Add image optimization settings
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
