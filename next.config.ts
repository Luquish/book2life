import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': path.join(__dirname, 'src')
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  }
};

export default nextConfig;
