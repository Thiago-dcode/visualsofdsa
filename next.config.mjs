/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Emits .next/standalone (server.js + traced node_modules) for the Docker runner stage.
  output: "standalone",
};

export default nextConfig;
