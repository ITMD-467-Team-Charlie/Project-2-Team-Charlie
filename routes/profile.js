var express = require('express');
var router = express.Router();
const profileModel = require("../models/ProfileModel");
const RecipeController = require("../controllers/RecipeController");
const httpreq = require("request");
/**
 * 
 */
router.get('/', function(req, res, next) {
    var usercookie = req.cookies.profile;
    if (typeof usercookie === 'undefined') { // Executes if variable is null OR undefined
        res.render('profile', { result: false, user: '', title: 'Nutrition Guide : Team Charlie Project' });
    } else {
        profileModel.findById(usercookie, function(err, profile) {
            if (err) {
                return console.log('error when fetching profile:', err);
            }
            if (profile) {
                //Compare given password with db's hash.
                let profileData = {
                    _id: profile._id,
                    name: profile.name,
                    age: profile.age,
                    sex: profile.sex,
                    heightfeet: profile.heightfeet,
                    heightinch: profile.heightinch,
                    weight: profile.weight,
                    activity: profile.activity,
                    goal: profile.goal,
                    ratio: profile.ratio,
                    bml: profile.bmi,
                    calories: profile.calories,
                    ccarbs: profile.ccarbs,
                    cprotons: profile.cprotons,
                    cfats: profile.cfats,
                    carbs: profile.carbs,
                    protons: profile.protons,
                    fats: profile.fats
                };
                req.session.user = profileData;
                RecipeController.recipeListPage(req, res, profileData);
            } else {
                req.session.user = '';
                res.render('profile', { result: false });
            }
        });
    }
});

router.post('/find', function(req, res) {
    var userprofile = new profileModel(req.session.user);
    res.cookie('profile', userprofile._id, {
        maxAge: 365 * 24 * 60 * 60 * 1000 // 24 hours
    });
    // save user
    userprofile.save(function(err) {
        if (err) {
            return console.log('Error while saving profile to DB:', err);
        }
    });
    RecipeController.recipeListPage(req, res, userprofile);
});

router.post("/calculate", async(req, res) => {
    try {
        var user = new Object();
        user.name = req.body.name;
        user.age = req.body.age;
        user.sex = req.body.sex;
        user.heightfeet = req.body.heightfeet;
        user.heightinch = req.body.heightinch;
        user.weight = req.body.weight;
        user.activity = req.body.activity;

        user = calculateBMI(user);

        user = calculateBMR(user);
        req.session.user = user;
        res.render('profile', { result: true, user: user });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});


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

function sum(arr) {
    const reducer = (sum, val) => sum + val;
    const initialValue = 0;
    console.log('sum', arr.reduce(reducer, initialValue));
    return arr.reduce(reducer, initialValue);
}

function calculateBMR(user) {

    user.carbratio = 0.4;
    user.protonratio = 0.3;
    user.fatratio = 0.3;

    const height = ((user.heightfeet * 30.48) + (user.heightinch * 2.54));
    if (user.sex == 'M') {
        user.calories = ((user.weight * 10) + (height * 6.25) - (user.age * 5) + 5);
    } else {
        user.calories = ((user.weight * 10) + (height * 6.25) - (user.age * 5) - 161);
    }

    switch (user.activity) {
        case "S":
            user.calories = Math.round(user.calories * 1.2);
            break;
        case "L":
            user.calories = Math.round(user.calories * 1.375);
            break;
        case "M":
            user.calories = Math.round(user.calories * 1.550);
            break;
        case "V":
            user.calories = Math.round(user.calories * 1.725);
            break;
        case "E":
            user.calories = Math.round(user.calories * 1.9);
            break;
    }

    switch (user.goal) {
        case "weight-loss":
            user.carbratio = 0.4;
            user.protonratio = 0.4;
            user.fatratio = 0.2;
            if (user.calories <= 2000) user.calories = Math.round(0.9 * user.calories);
            if (user.calories > 2000) user.calories = Math.round(0.8 * user.calories);
            user.ccarbs = Math.round(user.carbratio * user.calories);
            user.cprotons = Math.round(user.protonratio * user.calories);
            user.cfats = Math.round(user.fatratio * user.calories);
            user.carbs = Math.round(user.carbratio * user.calories / 4);
            user.protons = Math.round(user.protonratio * user.calories / 4);
            user.fats = Math.round(user.fatratio * user.calories / 9);
            user.ratio = "40% carbs / 40% protein / 20% fats"
            break;
        case "maintenance":
            user.ccarbs = Math.round(user.carbratio * user.calories);
            user.cprotons = Math.round(user.protonratio * user.calories);
            user.cfats = Math.round(user.fatratio * user.calories);
            user.carbs = Math.round(user.carbratio * user.calories / 4);
            user.protons = Math.round(user.protonratio * user.calories / 4);
            user.fats = Math.round(user.fatratio * user.calories / 9);
            user.ratio = "40% carbs / 30% protein / 30% fats"
            break;
        case "weight-gain":
            user.calories += 500;
            user.ccarbs = Math.round(user.carbratio * user.calories);
            user.cprotons = Math.round(user.protonratio * user.calories);
            user.cfats = Math.round(user.fatratio * user.calories);
            user.carbs = Math.round(user.carbratio * user.calories / 4);
            user.protons = Math.round(user.protonratio * user.calories / 4);
            user.fats = Math.round(user.fatratio * user.calories / 9);
            user.ratio = "40% carbs / 30% protein / 30% fats"
            break;
    }
    return user;
}

function calculateBMI(user) {

    var totalfeethight = (user.heightfeet * 0.3048) + (user.heightinch * 0.0254);
    var bmivalue = user.weight / (totalfeethight * totalfeethight);
    bmivalue = Math.round(bmivalue);
    user.bmi = bmivalue;
    if (bmivalue < 18.5) {
        user.goal = 'weight-gain';
        user.status = 'under-weight';
    } else if (bmivalue >= 18.5 && bmivalue <= 25) {
        user.goal = 'maintenance';
        user.status = 'normal-weight';
    } else if (bmivalue > 25) {
        user.goal = 'weight-loss';
        user.status = 'over-weight';
    }
    return user;
}


module.exports = router;