/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "", // usually empty
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
