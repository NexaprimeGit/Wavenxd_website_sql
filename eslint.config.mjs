<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // 🔥 guarantees NO crashes
  },
};

module.exports = nextConfig;
=======
import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
];

export default config;
>>>>>>> fcb3146ac3ec8f2eb51c38b89e92855960a48e99
