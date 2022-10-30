/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('read-pkg-up').sync().packageJson;
module.exports = `/*! ${pkg.name} v${
  pkg.version
} (${new Date().toLocaleDateString()}) | ${pkg.description} */`;
