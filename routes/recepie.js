var express = require('express');
const RecipeController = require("../controllers/RecipeController");

var router = express.Router();

router.get("/", RecipeController.recipeList);

module.exports = router;