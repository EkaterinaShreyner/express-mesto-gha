const router = require('express').Router();

const {
  getCards,
  createNewCard,
  deleteCardById,
  putLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createNewCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId', putLikeCard);

module.exports = router;