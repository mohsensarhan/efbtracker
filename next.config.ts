import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Enable TypeScript checking gradually - will now show type errors
    ignoreBuildErrors: false,
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // Enable ESLint during builds for better code quality
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
