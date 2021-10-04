const express = require('express');
const itemController = require("../controllers/items.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.post('/:categoryId', ensureAuth, itemController.addItem);

router.put('/:categoryId/:itemId', ensureAuth, itemController.editItem);

router.delete('/:categoryId/:itemId', ensureAuth, itemController.deleteItem);

module.exports = router;