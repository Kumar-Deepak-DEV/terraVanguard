const express = require('express');
const router = express.Router();
const { getEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/hallOfFameController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getEntries).post(protect, admin, createEntry);
router.route('/:id').put(protect, admin, updateEntry).delete(protect, admin, deleteEntry);

module.exports = router;
