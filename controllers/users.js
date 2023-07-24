/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // для создания токена

const {
  SUCCESS_CREATE__REQUEST,
  // ERROR_UNAUTHORIZED,
  ERROR_REQUEST,
  // ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('../utils/constants');

const User = require('../models/users'); // импортируем модель user
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// запрос всех пользователей
function getUsers(_req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    // .catch((err) => {
    //   console.log(err.name);
    //   res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    // });
    .catch((err) => next(err));
}

// запрос пользователя по id
function getUserById(req, res, next) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      console.log(userId);
      if (!user) {
        // return res.status(ERROR_NOT_FOUND).send({ message: 'Польз-ль с такими id не найден' });
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорре данные id поль-ля' });
        next(new BadRequestError('Переданы некорректные данные id пользователя'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      next(err);
    });
}

// запрос текущего пользователя
function getCurrentUser(req, res, next) {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        // return res.status(ERROR_NOT_FOUND).send({ message: 'Пользов c таким id не найден' });
        throw new NotFoundError('Пользователь c таким id не найден');
      }
      return res.send(user);
    })
    // .catch((err) => {
    //   console.log(err.name);
    //   return res.status(ERROR_REQUEST).send({ message: 'Переданы некорре данные id польз' });
    //   // next(new BadRequestError('Переданы некорректные данные id пользователя'));
    // });
    .catch((err) => next(err));
}

// создание нового пользователя
function createUser(req, res, next) {
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
    .then((user) => res.status(SUCCESS_CREATE__REQUEST).send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    ))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email зарегистрирован'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

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
      console.log(user);
      // res.send({ token });
      // хранение токена в куки на 7 дней
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    // .catch((err) => {
    //   res.status(ERROR_UNAUTHORIZED).send({ message: err.message });
    // })
    .catch(next);
}

// замена данных пользователя
function patchUser(req, res, next) {
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
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

// замена аватара пользователя
function patchUserAvatar(req, res, next) {
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
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные' });
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
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
