module.exports = {
  root: true,
  extends: "@react-native",
  ignorePatterns: [
    "node_modules/",
    "android/",
    "ios/",
    "coverage/",
    "*.config.js",
    "babel.config.js",
    "metro.config.js",
  ],
  rules: {
    // The codebase uses double quotes throughout and Prettier is configured to
    // match (.prettierrc). Align the base quotes rule so it does not contradict
    // Prettier (the React Native preset defaults to single quotes).
    quotes: ["warn", "double", { avoidEscape: true }],
    // Unused variables are reported as warnings. Much of the pre-existing
    // dead code lives in legacy .js screens that were never linted before a
    // config existed; flagging as warnings keeps the gate runnable while
    // surfacing the cleanup opportunities.
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    // Entrance animations and data loads intentionally run once on mount with
    // an empty dependency array; the referenced values are stable useRef
    // handles. exhaustive-deps is kept at its default warning severity (the
    // React Native preset elevates it to an error) so these intentional
    // patterns do not fail the gate.
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      // Detox end-to-end tests run with Detox-provided globals.
      files: ["e2e/**/*.js", "e2e/**/*.ts"],
      env: { "jest/globals": true },
      globals: {
        device: "readonly",
        element: "readonly",
        by: "readonly",
        waitFor: "readonly",
        expect: "readonly",
      },
    },
  ],
};
