'use strict';
/** Express router providing api related routes
 * @module routes/api
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
 * @namespace apiRouter
 */
const apirouter = express.Router();
const RecipeController = require('../controllers/RecipeController');

/**
 * Route serving Get list API for recipes as json response.
 * @name get/recepie
 * @function
 * @memberof module:routes/api~apiRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - RecipeController.recipeListAPI
 * @return {object} json - list of recipes
 */
apirouter.get('/recepie', RecipeController.recipeListAPI);

module.exports = apirouter;
