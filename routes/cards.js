const router = require('express').Router();

const {
  getCards,
  createNewCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createNewCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;