// Use ts-node to interpret the TypeScript config and export it
require('ts-node/register');
const { databaseConfig } = require('./database.config.ts');
module.exports = databaseConfig;
