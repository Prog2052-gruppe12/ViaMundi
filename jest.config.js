const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/utils/**/*.{js,jsx}',
    'src/lib/date/**/*.{js,jsx}',
    'src/components/**/schema.js',
    '!**/*.test.{js,jsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)

