const Card = require('../models/card');

const {
  success_request,
  success_create_request,
  error_request,
  error_not_found,
  error_server
} = require('../utils/constants');

// запрос всех карточек
function getCards(_req, res) {
  Card.find({})
    .then((cards) => res.status(success_request).send(cards))
    .catch(() => res.status(error_server).send({ message: 'Произошла ошибка на сервере' }))
}

function createCard(req, res) {
  const { name, link, owner } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(success_create_request).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(error_request).send({ message: ' Переданы некорректные данные карточки' })
      }
        return res.status(error_server).send({ message: 'Произошла ошибка на сервере' })
    })
}

module.exports = {
  getCards,
  createCard,
}