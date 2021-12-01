const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const config = require('./config_default');

const env = process.env.NODE_ENV || 'local';
const mergeConfigPath = path.join(__dirname, `./config_${env}.js`);
assert(fs.existsSync(mergeConfigPath), `${mergeConfigPath} must exist`);

let configObj = null;
try {
  const envConfig = require(`./config_${env}`);
  configObj = _.merge(config, envConfig);
  assert(configObj, 'config is null');
} catch (e) {
  throw new Error('loading config failed:', e);
}
module.exports = configObj;
