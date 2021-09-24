const express = require('express');
const categoryController = require("../controllers/category.controller");
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

router.get('/', ensureAuth, categoryController.getCategories);

module.exports = router;