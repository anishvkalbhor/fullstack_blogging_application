import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const nextConfig: NextConfig = {
  transpilePackages: ["api", "db"],
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  reactCompiler: true,
};

export default nextConfig;
