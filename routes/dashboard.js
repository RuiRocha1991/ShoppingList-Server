const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/', ensureAuth, (req, res) => {
  res.status(200).json({message: "Welcome guys GET"})
});

module.exports = router;