// импортируем модель user
const User = require('../models/users');

const {
  success_request,
  success_create_request,
  error_request,
  error_not_found,
  error_server
} = require('../utils/constants')


// запрос всех пользователей
function getUsers(_req, res) {
  User.find({})
    .then((user) => res.status(success_request).send(user))
    .catch(() => res.status(error_server).send({ message: 'Произошла ошибка на сервере' }));
}

// запрос пользователя по id
function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      console.log(userId)
      console.log(user)
      return res.status(success_request).send(user)
      // if (!user) {
      //   console.log('не найден')
      //   return res.status(404).send({ message: 'Пользователь не найден' })
      // } else {
      //   console.log('Найден')
      //   return res.status(200).send(user);
      // }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(error_not_found).send({ message: 'Пользователь не найден'});
      }
        return res.status(error_server).send({ message: 'Произошла ошибка на сервере' });
    });
}

// создание нового пользователя
function postNewUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(success_create_request).send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(error_request).send({ message: 'Переданы некорректные данные' })
      }
        return res.status(error_server).send({ message: 'Произошла ошибка на сервере' })
    });
}

// замена данных пользователя
function patchUser(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (!name || !about) {
    return res.status(error_request).send({ message: 'Переданы некорректные данные пользователя' })
  }
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: false // если пользователь не найден, он не будет создан
    }
  )
    .then((user) => res.status(success_request).send(user))
    // .then((user) => console.log({ name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(error_request).send({ message: 'Переданы некорректные данные' })
      }
        return res.status(error_server).send({ message: 'Произошла ошибка на сервере' })
    })
}

// замена аватара пользователя
function patchUserAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;
  if (!avatar) {
    return res.status(error_request).send({ message: 'Переданы некорректные данные аватара' })
  }
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: false // если пользователь не найден, он не будет создан
    }
  )
    .then((user) => res.status(success_request).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(error_request).send({ message: 'Переданы некорректные данные' })
      }
        return res.status(error_server).send({ message: 'Произошла ошибка на сервере' })
    })
}

module.exports = {
  getUsers,
  getUserById,
  postNewUser,
  patchUser,
  patchUserAvatar,
};
