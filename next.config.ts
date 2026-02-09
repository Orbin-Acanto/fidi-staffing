import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/media/public/:path*",
        destination: `${process.env.DJANGO_API_URL}/api/media/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
