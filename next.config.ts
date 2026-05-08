import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/student/admin", destination: "/student/dashboard", permanent: false },
      { source: "/studen/admin", destination: "/student/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
