const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', patchUser);
router.get('/:userId', getUserById);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
