import type { NextConfig } from "next";

const alias = {
  "react-native$": "react-native-web",
  "@react-native/assets-registry/registry$": "react-native-web/dist/modules/AssetRegistry",
};
const web = [".web.tsx", ".web.ts", ".web.jsx", ".web.js"];

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@hanzo/gui", "@hanzo/ui", "@hanzogui/shell", "react-native-web"],
  images: {
    unoptimized: true,
  },
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
      "@react-native/assets-registry/registry": "react-native-web/dist/modules/AssetRegistry",
    },
    resolveExtensions: [...web, ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, ...alias };
    config.resolve.extensions = [...web, ...config.resolve.extensions];
    return config;
  },
};

export default nextConfig;
