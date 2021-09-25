const express = require('express');
const categoryController = require("../controllers/category.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.get('/', ensureAuth, categoryController.getCategories);

//#region POST
router.post('/', ensureAuth, categoryController.addCategory);
//#endregion


module.exports = router;