
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  transformIgnorePatterns: ['/node_modules/'],
};
