import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["api", "db"],
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  reactCompiler: true,
};

export default nextConfig;
