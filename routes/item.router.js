const express = require('express');
const itemController = require("../controllers/items.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.get('/', ensureAuth, itemController.getItemsByUserId);

module.exports = router;