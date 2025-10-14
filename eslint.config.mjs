import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  {
    files: ["test/**/*.{js,mjs,cjs}", "**/*.test.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
];
