/** @type {import {'ts-jest'}.Jest.ConfigWithTSJest } */

console.log("jest is loaded");
module.exports ={
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    //roots: ['<rootDir>/src/main/test'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTest.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }],
    },
    moduleFileExtensions : ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^main/(.*)$': '<rootDir>/src/main/$1'
    }
}