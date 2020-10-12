const mongoose = require('../index');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  phone: Number,
  password: String,
  createAt: { type: Date, default: Date.now() },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
