import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  // output: "export",
  // distDir: "dist",
  // webpack: (config) => {
  //   // @shared → packages/shared/dist にエイリアス解決
  //   config.resolve.alias["@shared"] = path.resolve(__dirname, "../../../../../../../packages/shared/src");
  //   return config;
  // }
};

export default nextConfig;
