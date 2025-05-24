import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      rules: {
        "**/*.yaml": {
          loaders: ['yaml-loader'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;
