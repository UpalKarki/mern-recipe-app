const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getMyReviews } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.get('/my-reviews', protect, getMyReviews);

module.exports = router;