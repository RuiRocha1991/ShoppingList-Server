const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const shoppingListController = require('../controllers/shoppingList.controller');

router.get('/', ensureAuth, shoppingListController.getShoppingList);

router.post('/', ensureAuth, shoppingListController.addShoppingList);

router.put('/:id', ensureAuth, shoppingListController.editShoppingList);

router.put('/save/:id', ensureAuth, shoppingListController.saveShoppingList);

router.put('/shoppingMode/start/:id', ensureAuth, shoppingListController.startShoppingMode);

router.put('/shoppingMode/save/:id', ensureAuth, shoppingListController.saveShoppingMode);

router.put('/shoppingMode/finish/:id', ensureAuth, shoppingListController.finishShoppingMode);

router.delete('/:id', ensureAuth, shoppingListController.deleteShoppingList);

module.exports = router;