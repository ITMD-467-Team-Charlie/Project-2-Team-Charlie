const apiResponse = require("../helpers/apiResponse");
const httpreq = require("request");
const { endpoint, key, id } = require('../utils/config');

/**
 * RecipeController.
 * 
 * @returns {Object}
 */
exports.recipeList = function(req, res) {

    try {
        var c = '0-10000';
        var query = '&from=1&to=30';
        if (typeof req.session.user !== 'undefined') {
            c = '0-' + req.session.user.calories;
        }
        if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
            query = '&from=' + req.query.from + '&to=' + req.query.to;
        }
        // load dishes fom external API
        httpreq.get(endpoint + '?q=&calories=' + c + '&ingr=25&app_id=' + id + '&app_key=' + key + query, (err, response, body) => {
            if (err) {
                return apiResponse.ErrorResponse(response, err);
            }

            let fulljson = JSON.parse(body);
            dishes = enrichJson(fulljson.hits);

            apiResponse.successResponseWithData(res, "Operation success", dishes);

        });
    } catch (err) {
        //throw error in json response with status 500. 
        return apiResponse.ErrorResponse(res, err);
    }

};

exports.recipeListPage = function(req, res, profileData) {

    try {
        var c = '0-10000';
        var query = '&from=1&to=30';
        if (typeof req.session.user !== 'undefined') {
            c = '0-' + req.session.user.calories;

        }
        if (typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined') {
            query = '&from=' + req.query.from + '&to=' + req.query.to;
        }
        // load dishes fom external API
        httpreq.get(endpoint + '?q=&calories=' + c + '&ingr=25&app_id=' + id + '&app_key=' + key + query, (err, response, body) => {
            if (err) {
                return apiResponse.ErrorResponse(response, err);
            }

            let fulljson = JSON.parse(body);
            dishes = enrichJson(fulljson.hits);
            res.render('home', { result: false, profile: profileData, dishes: dishes });

        });
    } catch (err) {
        //throw error in json response with status 500. 
        return apiResponse.ErrorResponse(res, err);
    }

};

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