const express = require('express');
const RecipeController = require('../controllers/RecipeController');

const router = express.Router();

router.get('/', RecipeController.recipeList);

module.exports = router;
