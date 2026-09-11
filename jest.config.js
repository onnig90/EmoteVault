/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    // Plain TypeScript, no screens and no device, so these run in Node. Nothing
    // under test imports React Native - that is what keeps the run this fast.
    testEnvironment: "node",
};
