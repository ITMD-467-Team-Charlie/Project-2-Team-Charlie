const apiResponse = require("../helpers/apiResponse");
const httpreq = require("request");
const { endpoint, key, id } = require('../utils/config');
const recipeModel = require('../models/RecipeModel');

/**
 * Fetch list of recipes from the configured external service as API.
 * @param req Request object
 * @param res Response object
 * @returns {Object} JSON
 */
exports.recipeList = function(req, res) {

    try {
        var c = '0-10000';
        var query = '&from=1&to=30';
        var q = '';
        if (typeof req.session.user !== 'undefined') {
            c = '0-' + req.session.user.calories;
        }
        if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
            query = '&from=' + req.query.from + '&to=' + req.query.to;
        }
        if (typeof req.query.q !== 'undefined') {
            q = req.query.q;
        }
        // load dishes fom external API
        httpreq.get(endpoint + '?q=' + q + '&calories=' + c + '&ingr=25&app_id=' + id + '&app_key=' + key + query, (err, response, body) => {
            if (err) {
                return apiResponse.ErrorResponse(response, err);
            }
            let fulljson = JSON.parse(body);
            dishes = enrichJson(fulljson.hits);
            saveJson(dishes);
            apiResponse.successResponseWithData(res, "Operation success", dishes);
        });
    } catch (err) {
        //throw error in json response with status 500. 
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
exports.recipeListPage = function(req, res, profileData) {

    try {
        var c = '0-10000';
        var query = '&from=1&to=30';
        var q = '';
        if (typeof req.session.user !== 'undefined') {
            c = '0-' + req.session.user.calories;

        }
        if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
            query = '&from=' + req.query.from + '&to=' + req.query.to;
        }
        if (typeof req.query.q !== 'undefined') {
            q = req.query.q;
        }
        // load dishes fom external API
        httpreq.get(endpoint + '?q=&calories=' + c + '&ingr=25&app_id=' + id + '&app_key=' + key + query, (err, response, body) => {
            if (err) {
                return apiResponse.ErrorResponse(response, err);
            }

            let fulljson = JSON.parse(body);
            dishes = enrichJson(fulljson.hits);
            saveJson(dishes);
            res.render('home', { result: false, profile: profileData, dishes: dishes });
        });
    } catch (err) {
        //throw error in json response with status 500. 
        return apiResponse.ErrorResponse(res, err);
    }
};

/**
 * Function to re process the service json out put with calcualted percentages 
 * @param {Object} JSON List of dishes.
 * @returns  {Object} JSON processed with new attributes.
 */
function enrichJson(dishes) {

    for (let dish of dishes) {
        var id = dish.recipe.uri.split('#')[1];
        dish.id = id;
        var percentages = [];
        var nutrients = dish.recipe.digest.slice(0, 3);
        var nutrient_cal = (parseInt(nutrients[0].total.toFixed(0)) * 9) + (parseInt(nutrients[1].total.toFixed(0)) * 4) + (parseInt(nutrients[2].total.toFixed(0)) * 4);

        for (let digest of nutrients) {
            var total = digest.total.toFixed(0);
            var per = 0;
            switch (digest.label) {
                case 'Fat':
                    per = parseInt((((total * 9) / nutrient_cal) * 100).toFixed(0));
                    dish.fat = total;
                    break;
                case 'Carbs':
                    per = parseInt((((total * 4) / nutrient_cal) * 100).toFixed(0));
                    dish.carb = total;
                    break;
                case 'Protein':
                    per = parseInt((((total * 4) / nutrient_cal) * 100).toFixed(0));
                    dish.protein = total;
                    break;
                default:
                    // code block
            }
            percentages.push(per);
        }
        // round-off correction
        if (sum(percentages) > 100) {
            var diff = percentages.reduce(sum) - 100;
            percentages[1] -= diff;
        }

        dish.fatr = percentages[0];
        dish.carbr = percentages[1];
        dish.protiner = percentages[2];
    }
    return dishes;
}

function sum(total, num) {
    return total + num;
}

/**
 * Function to save the recipes json output to database
 * @param {Object} JSON List of dishes.
 * @returns  {Object} JSON processed with new attributes.
 */
function saveJson(dishes) {

    dishes.forEach(async dish => {

        let recipeToAdd = await recipeModel.find({ rid: dish.id });
        if (recipeToAdd.length === 0) {
            dish = JSON.parse(JSON.stringify(dish).replace('SUGAR.added', 'SUGAR-added'));
            console.log('Save Recipe: ', dish.recipe.label);
            var recipe = new recipeModel({
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
                ingredientLines: dish.recipe.cautions,
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
            console.log('Recipe already exists: ', dish.recipe.label);
        }
    })
}