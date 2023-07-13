/* eslint-disable consistent-return */
/* eslint-disable no-console */
// импортируем модель user
const User = require('../models/users');

const {
  SUCCESS__REQUEST,
  SUCCESS_CREATE__REQUEST,
  ERROR_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('../utils/constants');

// запрос всех пользователей
function getUsers(_req, res) {
  User.find({})
    .then((user) => res.status(SUCCESS__REQUEST).send(user))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' }));
}

// запрос пользователя по id
function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      console.log(userId);
      console.log(user);
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с такими id не найден' });
      }
      res.status(SUCCESS__REQUEST).send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные id пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

// создание нового пользователя
function postNewUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
    .then((user) => res.status(SUCCESS__REQUEST).send(user))
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
    .then((user) => res.status(SUCCESS__REQUEST).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    });
}

module.exports = {
  getUsers,
  getUserById,
  postNewUser,
  patchUser,
  patchUserAvatar,
};
