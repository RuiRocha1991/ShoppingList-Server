const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const shoppingListController = require('../controllers/shoppingList.controller');

router.get('/', ensureAuth, shoppingListController.getShoppingList);

router.post('/', ensureAuth, shoppingListController.addShoppingList);

router.put('/:id', ensureAuth, shoppingListController.editShoppingList);

router.delete('/:id', ensureAuth, shoppingListController.deleteShoppingList);

module.exports = router;