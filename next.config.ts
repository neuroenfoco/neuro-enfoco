import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sesiones",
        destination: "/intervenciones",
        permanent: true,
      },
      {
        source: "/sesiones/nueva",
        destination: "/intervenciones/nueva",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
