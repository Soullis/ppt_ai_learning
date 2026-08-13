/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ppt_ai_learning',
  assetPrefix: '/ppt_ai_learning/', // Add this line
  images: {
    unoptimized: true,
  },
};

export default nextConfig;