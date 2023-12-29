/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/setupEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/test/setupFile.js"],
  // globalSetup: "<rootDir>/test/globalSetup.js",
  // globalTeardown: "<rootDir>/test/globalTeardown.js",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};

module.exports = config;
