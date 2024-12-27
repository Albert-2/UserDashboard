import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http", hostname: "127.0.0.1", port: "3000"
      }, {
        protocol: "http", hostname: "127.0.0.1", port: "5000"
      },
      {
        protocol: "https", hostname: "https://dashboard-server-kappa.vercel.app", port: ""
      }, {
        protocol: "https", hostname: "https://user-dashboard-woad-zeta.vercel.app", port: ""
      }
    ],
  },async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://dashboard-server-kappa.vercel.app/:path*',
          },
          {
            source: '/api/:path*',
            destination: 'https://user-dashboard-woad-zeta.vercel.app/:path*',
          },
        ]
      },
};
export default nextConfig;
