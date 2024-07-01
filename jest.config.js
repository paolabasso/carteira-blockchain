module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
        "^/opt/nodejs/blockchainWalletsLayer$": "<rootDir>/lambda/blockchainWallets/layers/blockchainWalletsLayer/nodejs/blockchainWalletRepository",
    },
};
