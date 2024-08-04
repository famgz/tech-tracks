/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**.dio.me",
      },
    ],
  },
};

export default nextConfig;
