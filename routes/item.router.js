const express = require('express');
const itemController = require("../controllers/items.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.get('/', ensureAuth, itemController.getItemsByUserId);

router.post('/', ensureAuth, itemController.addItem);

router.put('/:id', ensureAuth, itemController.editItem);

module.exports = router;