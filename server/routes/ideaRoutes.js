const express = require('express');
const router = express.Router();
const { getIdeas, createIdea, upvoteIdea, deleteIdea, approveIdea } = require('../controllers/ideaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getIdeas).post(protect, createIdea);
router.route('/:id/upvote').post(protect, upvoteIdea);
router.route('/:id').delete(protect, admin, deleteIdea);
router.route('/:id/approve').put(protect, admin, approveIdea);
router.route('/:id/comments').get(protect, require('../controllers/ideaController').getComments).post(protect, require('../controllers/ideaController').addComment);

module.exports = router;
