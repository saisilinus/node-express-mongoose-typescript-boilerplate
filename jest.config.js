export default {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'dist/config', 'dist/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
