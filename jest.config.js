module.exports = {
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest'
    },
    testMatch: ['**/tests/**/*.spec.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
