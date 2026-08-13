/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ppt_ai_learning',
  images: {
    unoptimized: true, // Prevents errors if you use <Image /> tags
  },
};

export default nextConfig;