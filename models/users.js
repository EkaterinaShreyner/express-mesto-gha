const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
  },
});

// метод findUserByCredentials,принимает на вход почту и пароль и
// возвращает объект пользователя или ошибку
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }) // найти пользователя по почте
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта'));
      }
      return bcrypt.compare(password, user.password) // если user нашелся сравниваем хеши
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные пароль'));
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
