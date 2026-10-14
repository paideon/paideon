const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

module.exports = createJestConfig({
  displayName: 'portal',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  coverageDirectory: 'test-output/jest/coverage',
});
