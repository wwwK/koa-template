const mongoose = require('mongoose');
const {
  db: { mongodbConfig },
} = require('../../config/config_default');

mongoose.connect(mongodbConfig.url, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('mongoDB connect success');
});

module.exports = mongoose;
