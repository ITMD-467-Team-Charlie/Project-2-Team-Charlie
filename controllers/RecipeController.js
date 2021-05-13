'use strict';
/**
 * Controller for processing recipe and api requests
 *
 * @module recipeController
 */
const httpreq = require('request');
const mongoose = require('mongoose');
const apiResponse = require('../helpers/apiResponse');
const { endpoint, key, id } = require('../utils/config');

const RecipeModel = mongoose.model('Recipe');

function sum(total, num) {
  return total + num;
}

/**
 * Function to re process the service json out put with calcualted percentages
 * @param {Object} JSON List of dishes.
 * @returns  {Object} JSON processed with new attributes.
 */
function enrichJson(dishes) {
  Object.keys(dishes).forEach((d) => {
    const dish = dishes[d];
    dish.id = dish.recipe.uri.split('#')[1];
    const percentages = [];
    const nutrients = dish.recipe.digest.slice(0, 3);
    const nutrientCal = (Number(nutrients[0].total.toFixed(0)) * 9)
    + (Number(nutrients[1].total.toFixed(0)) * 4)
    + (Number(nutrients[2].total.toFixed(0)) * 4);

    Object.keys(nutrients).forEach((k) => {
      const digest = nutrients[k];
      const total = digest.total.toFixed(0);
      let per = 0;
      switch (digest.label) {
      case 'Fat':
        per = Number((((total * 9) / nutrientCal) * 100).toFixed(0));
        dish.fat = total;
        break;
      case 'Carbs':
        per = Number((((total * 4) / nutrientCal) * 100).toFixed(0));
        dish.carb = total;
        break;
      case 'Protein':
        per = Number((((total * 4) / nutrientCal) * 100).toFixed(0));
        dish.protein = total;
        break;
      default:
              // code block
      }
      percentages.push(per);
    });
    // round-off correction
    if (sum(percentages) > 100) {
      const diff = percentages.reduce(sum) - 100;
      percentages[1] -= diff;
    }

    dish.fatr = percentages[0];
    dish.carbr = percentages[1];
    dish.protiner = percentages[2];
  });
  return dishes;
}

/**
 * Function to save the recipes json output to database
 * @param {Object} JSON List of dishes.
 * @returns  {Object} JSON processed with new attributes.
 */
function saveJson(dishes) {
  dishes.forEach(async (d) => {
    const recipeToAdd = await RecipeModel.find({ rid: d.id });
    if (recipeToAdd.length === 0) {
      const dish = JSON.parse(JSON.stringify(d).replace('SUGAR.added', 'SUGAR-added'));
      console.log('Save Recipe: ', dish.recipe.label);
      const recipe = new RecipeModel({
        uri: dish.recipe.uri,
        image: dish.recipe.image,
        name: dish.recipe.label,
        rid: dish.id,
        yield: dish.recipe.yield,
        calories: dish.recipe.calories,
        totalWeight: dish.recipe.totalWeight,
        dietLabels: dish.recipe.dietLabels,
        healthLabels: dish.recipe.healthLabels,
        cautions: dish.recipe.cautions,
        ingredientLines: dish.recipe.ingredientLines,
        cuisineType: dish.recipe.cuisineType,
        mealType: dish.recipe.mealType,
        fat: dish.fat,
        carb: dish.carb,
        protein: dish.protein,
        fatr: dish.fatr,
        carbr: dish.carbr,
        protiner: dish.protiner,
        totalNutrients: dish.recipe.totalNutrients,
        totalDaily: dish.recipe.totalDaily,
        digest: dish.recipe.digest
      });
      await recipe.save();
    } else {
      console.log('Recipe already exists: ', d.recipe.label);
    }
  });
}

/**
 * Fetch list of recipes from the configured external service as API.
 * @param req Request object
 * @param res Response object
 * @returns {Object} JSON
 */
exports.recipeListAPI = function recipeapi(req, res) {
  try {
    let c = '0-10000';
    let query = '&from=1&to=30';
    let q = '';
    if (typeof req.session.user !== 'undefined') {
      c = `0-${req.session.user.calories}`;
    }
    if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
      query = `&from=${req.query.from}&to=${req.query.to}`;
    }
    if (typeof req.query.q !== 'undefined') {
      q = req.query.q;
    }
    // load dishes fom external API
    httpreq.get(`${endpoint}?q=${q}&calories=${c}&ingr=25&app_id=${id}&app_key=${key}${query}`, (err, response, body) => {
      if (err) {
        return apiResponse.ErrorResponse(response, err);
      }
      const fulljson = JSON.parse(body);
      const dishes = enrichJson(fulljson.hits);
      saveJson(dishes);
      apiResponse.successResponseWithData(res, 'Operation success', dishes);
    });
  } catch (err) {
    // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err);
  }
};

/**
 * Fetch list of recipes from the configured external service as PAGE
 * @param req Request object
 * @param res Response object
 * @param Obj profileData User profile from session.
 * @returns {Object} HTML
 */
exports.recipeListPage = function recipepage(req, res, profileData) {
  try {
    let c = '0-10000';
    let query = '&from=1&to=30';
    let q = '';
    if (typeof req.session.user !== 'undefined') {
      c = `0-${req.session.user.calories}`;
    }
    if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
      query = `&from=${req.query.from}&to=${req.query.to}`;
    }
    if (typeof req.query.q !== 'undefined') {
      /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "q" }] */
      q = req.query.q;
    }
    // load dishes fom external API
    httpreq.get(`${endpoint}?q=&calories=${c}&ingr=25&app_id=${id}&app_key=${key}${query}`, (err, response, body) => {
      if (err) {
        return apiResponse.ErrorResponse(response, err);
      }

      const fulljson = JSON.parse(body);
      const dishes = enrichJson(fulljson.hits);
      saveJson(dishes);
      res.render('home', { result: false, profile: profileData, dishes });
    });
  } catch (err) {
    // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err);
  }
};

/**
 * Fetch recipes deatils from the database
 * @param req Request object
 * @param res Response object
 * @returns {Object} HTML
 */
exports.recipeDetails = async function details(req, res) {
  try {
    const recipeDetails = await RecipeModel.find({ rid: req.query.rid });
    let hl = recipeDetails[0].healthLabels;
    let dl = recipeDetails[0].dietLabels;
    Array.prototype.push.apply(hl, dl);
    res.render('details', { result: true, labels: hl, cautions: recipeDetails[0].cautions, inglines: recipeDetails[0].ingredientLines, digest: recipeDetails[0].digest});
  } catch (err) {
    // throw error in json response with status 500.
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};
