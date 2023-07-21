/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // для создания токена
const User = require('../models/users'); // импортируем модель user

const {
  SUCCESS_CREATE__REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('../utils/constants');

// создание контроллера аутентификации
function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создание токена
      const token = jwt.sign(
        { _id: user._id }, // зашифрованный в строку объект пользователя
        'some-secret-key',
        { expiresIn: '7d' }, // действие токена 7 дней
      );
      console.log(token);
      res.send({ token });
    })
    .catch((err) => {
      res.status(ERROR_UNAUTHORIZED).send({ message: err.message });
    })
    .catch(next);
}

// запрос всех пользователей
function getUsers(_req, res) {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' }));
}

// запрос пользователя по id
function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      console.log(userId);
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с такими id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные id пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

// запрос текущего пользователя
function getCurrentUser(req, res, next) {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      console.log(userId);
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь c таким id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные id пользователя' });
    })
    .catch(next);
}

// создание нового пользователя
function createUser(req, res) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10) // хеширование пароля
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
  // User.create({ name, about, avatar, email, password })
    .then((user) => res.status(SUCCESS_CREATE__REQUEST).send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

// замена данных пользователя
function patchUser(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (!name || !about) {
    return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
  }
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(user))
    // .then((user) => console.log({ name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

// замена аватара пользователя
function patchUserAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;
  if (!avatar) {
    return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные аватара' });
  }
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: false // если пользователь не найден, он не будет создан
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

module.exports = {
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  patchUser,
  patchUserAvatar,
};
