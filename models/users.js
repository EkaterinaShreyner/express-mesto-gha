const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    // default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
