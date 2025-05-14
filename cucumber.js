module.exports = {
  require: [
      "./dist/features/stepDefinition/**/*.js",  // ✅ Correct path for compiled step definitions
      "./dist/features/support/**/*.js"         // ✅ Correct path for compiled support files
  ],
  requireModule: ["ts-node/register"],
  format: ["progress"],
  paths: ["features/**/*.feature"],
  publishQuiet: true,
  default: '--publish-quiet'
};
