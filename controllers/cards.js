/* eslint-disable consistent-return */
/* eslint-disable no-console */
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  SUCCESS_CREATE__REQUEST,
  // ERROR_REQUEST,
  // ERROR_NOT_FOUND,
  // ERROR_SERVER,
} = require('../utils/constants');

// запрос всех карточек
function getCards(_req, res, next) {
  Card.find({})
    .then((cards) => res.send(cards))
    // .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' }));
    .catch((err) => next(err));
}

// создание новой карточки
function createNewCard(req, res, next) {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(SUCCESS_CREATE__REQUEST).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорре данные карточки' });
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

// удаление карточки
function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        console.log(card);
        // return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      if (card.owner !== userId) {
        throw new ForbiddenError('Попытка удалить чужую карточку невозможна');
      }
      return res.send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорр данные id карточки' });
        return next(new BadRequestError('Переданы некорректные данные id карточки'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

// установка лайка карточки
function LikeCard(req, res, next) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        console.log(card);
        // return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некорре данные карточки' });
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

// удаление лайка карточки
function deleteLikeCard(req, res, next) {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        console.log(card);
        // return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        throw new NotFoundError('карточка с таким id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        // return res.status(ERROR_REQUEST).send({ message: 'Переданы некоррек данные карточки' });
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      // return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
      return next(err);
    });
}

module.exports = {
  getCards,
  createNewCard,
  deleteCardById,
  LikeCard,
  deleteLikeCard,
};
