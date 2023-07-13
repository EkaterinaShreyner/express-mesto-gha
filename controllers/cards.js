const Card = require('../models/card');

const {
  SUCCESS__REQUEST,
  SUCCESS_CREATE__REQUEST,
  ERROR_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER
} = require('../utils/constants');

// запрос всех карточек
function getCards(_req, res) {
  Card.find({})
    .then((cards) => res.status(SUCCESS__REQUEST).send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' }))
}

// создание новой карточки
function createNewCard(req, res) {
  const { name, link, owner } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(SUCCESS_CREATE__REQUEST).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные карточки' })
      }
        return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
    })
}

// удаление карточки
function deleteCardById(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        console.log(card)
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' })
      }
        res.status(SUCCESS__REQUEST).send(card)
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные id карточки' })
      }
        return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
    })
}

// установка лайка карточки
function putLikeCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        console.log(card)
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' })
      }
        res.status(SUCCESS__REQUEST).send(card)
    })
    .catch((err) => {
      console.log(err.name)
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
    })
}

// удаление лайка карточки
function deleteLikeCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        console.log(card)
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' })
      }
        res.status(SUCCESS__REQUEST).send(card)
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return res.status(ERROR_REQUEST).send({ message: 'Переданы некорректные данные карточки' })
      }
      return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' })
    })
}

module.exports = {
  getCards,
  createNewCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard
}