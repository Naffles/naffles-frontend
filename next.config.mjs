/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "https://img.reservoir.tools/",
    ],
    remotePatterns: [
      {
        protocol: "https",

        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
