const express = require('express');
const router = express.Router();
const { getUsers, updateProfile, deleteUser, updateUserRole, updateUserDetails } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateProfile);
router.route('/basic').get(protect, require('../controllers/userController').getBasicUsers);
router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUserDetails);
router.route('/:id/role').put(protect, admin, updateUserRole);

module.exports = router;
