import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules - Enable critical ones
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "off", // Keep off for mapbox code
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      
      // React rules - Enable important ones
      "react-hooks/exhaustive-deps": "warn", // Critical for effects
      "react/no-unescaped-entities": "off", // Style preference
      "react/display-name": "off", // Not critical
      "react/prop-types": "off", // Using TypeScript
      
      // Next.js rules - Keep relaxed for now
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // JavaScript rules - Enable security-critical ones
      "prefer-const": "warn",
      "no-unused-vars": "off", // Handled by TypeScript
      "no-console": "warn", // Should use logger
      "no-debugger": "error", // Should not be in production
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
      "no-case-declarations": "warn",
      "no-fallthrough": "warn",
      "no-mixed-spaces-and-tabs": "error",
      "no-redeclare": "error",
      "no-undef": "off", // Handled by TypeScript
      "no-unreachable": "error", // Dead code
      "no-useless-escape": "warn",
    },
  },
];

export default eslintConfig;
