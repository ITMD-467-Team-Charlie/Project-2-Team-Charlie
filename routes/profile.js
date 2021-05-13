'use strict';
/** Express router providing user related routes
 * @module routes/profile
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Express router to mount user related functions.
 * @type {object}
 * @const
 * @namespace profileRouter
 */
const profileRouter = express.Router();

const ProfileController = require('../controllers/ProfileController');

/**
 * Route serving Get list of recipes based on user profile.
 * @name get/
 * @function
 * @memberof module:routes/profile~profileRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - ProfileController.userRecipeList
 */
profileRouter.get('/', ProfileController.userRecipeList);

/**
 * Route serving to Get list of recipes based on user profile after user registration.
 * @name post/find
 * @function
 * @memberof module:routes/profile~profileRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - ProfileController.saveProfile
 */
profileRouter.post('/find', ProfileController.saveProfile);

/**
 * Route serving to Add a recepie to user profile.
 * @name post/addrecepie
 * @function
 * @memberof module:routes/profile~profileRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - ProfileController.saveRecepie
 */
profileRouter.post('/addrecepie', ProfileController.saveRecepie);

/**
 * Route serving to Get recepies from user profile.
 * @name get/myrecipes
 * @function
 * @memberof module:routes/profile~profileRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - ProfileController.savedRecepies
 */
profileRouter.get('/myrecipes', ProfileController.savedRecepies);

/**
 * Route serving to Calculate BMI and Caloris for user profile.
 * @name post/calculate
 * @function
 * @memberof module:routes/profile~profileRouter
 * @inner
 * @param {string} path - Express path
 * @param {function} contoller - ProfileController.analyzeProfile
 */
profileRouter.post('/calculate', ProfileController.analyzeProfile);

module.exports = profileRouter;
