/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  // transform: {
  //   "^.+\.tsx?$": ["ts-jest",{}],
  // },
  preset: "ts-jest",
  testMatch: [
    // "**/tests/**/*.test.ts", 
    "**/features/**/tests/*.test.ts"], // テストファイルのパターン
  // setupFiles: ["dotenv/config"], // `.env` の環境変数をロード
  clearMocks: true, // 各テストの後にモックをクリア
  coverageDirectory: "coverage", // カバレッジレポートの出力先
  collectCoverageFrom: ["src/**/*.ts"], // カバレッジ収集対象
  moduleFileExtensions: ["ts", "js", "json"],
  moduleDirectories: ["node_modules", "src"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
  },
};
