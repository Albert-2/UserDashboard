import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
  remotePatterns: [{
    protocol: "http", hostname: "127.0.0.1", port: "3000"
  },{
    protocol: "http", hostname: "127.0.0.1", port: "5000"
  }],
  }
};

export default nextConfig;
