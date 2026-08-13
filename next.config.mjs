/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained build at .next/standalone, copied by the Dockerfile.
  // Required for serving on Hugging Face Spaces with the Docker SDK.
  output: "export",
  basePath: '/ppt_ai_learning',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
