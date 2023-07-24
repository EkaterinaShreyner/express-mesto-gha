const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createNewCard,
  deleteCardById,
  LikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const { regex } = require('../utils/constants');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
}), createNewCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), LikeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
}), deleteLikeCard);

module.exports = router;
