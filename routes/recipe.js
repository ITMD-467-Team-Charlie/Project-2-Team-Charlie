'use strict';
/** Express router providing recipe related routes
 * @module routes/recipe
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Express router to mount api related functions.
 * @type {object}
 * @const
 * @namespace recipeRouter
 */
const reciperouter = express.Router();
const RecipeController = require('../controllers/RecipeController');

/**
 * Route serving Get list API for recipes as json response.
 * @name get/recepie
 * @function
 * @memberof module:routes/recipe~reciperouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - RecipeController.recipeDetails
 * @return {object} html - recipes details
 */
reciperouter.get('/recipe', RecipeController.recipeDetails);

module.exports = reciperouter;
