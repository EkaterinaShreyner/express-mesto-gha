const router = require('express').Router();

const {
  getUsers,
  getUserById,
  postNewUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', postNewUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
