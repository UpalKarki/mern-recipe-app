// authRoutes.js — placeholder routes, filled in Phase 2
const express = require('express');
const router = express.Router();

// Temporary placeholder so server.js doesn't crash on require
router.get('/', (req, res) => res.json({ message: 'Auth routes ready' }));

module.exports = router;