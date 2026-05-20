/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained build at .next/standalone, copied by the Dockerfile.
  // Required for serving on Hugging Face Spaces with the Docker SDK.
  output: "standalone",
};

export default nextConfig;
