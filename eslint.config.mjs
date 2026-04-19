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
