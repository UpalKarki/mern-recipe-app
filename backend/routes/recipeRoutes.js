const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Recipe routes ready' }));

module.exports = router;