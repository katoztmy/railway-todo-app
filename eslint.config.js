import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      "no-console": "warn",
    },
  },
];
