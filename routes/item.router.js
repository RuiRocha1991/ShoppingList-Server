const express = require('express');
const itemController = require("../controllers/items.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.get('/', ensureAuth, itemController.getItemsByUserId);

router.get('/:page/:rowsPerPage', ensureAuth, itemController.getItemsByUserIdPaginated);

router.post('/:categoryId', ensureAuth, itemController.addItem);

router.put('/:categoryId/:itemId', ensureAuth, itemController.editItem);

router.put('/:id', ensureAuth, itemController.editItem);

router.delete('/:id', ensureAuth, itemController.deleteItem);

router.delete('/:categoryId/:itemId', ensureAuth, itemController.deleteItem);

module.exports = router;