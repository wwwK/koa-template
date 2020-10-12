const fs = require('fs');
const path = require('path');

const dbDaos = {};

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const Dao = require(path.join(__dirname, file));
    const fileName = file.split('.')[0];
    dbDaos[fileName] = new Dao();
  });

module.exports = dbDaos;
