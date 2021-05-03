var express = require('express');
var router = express.Router();
const profileModel = require('../models/ProfileModel');
const recipeModel = require('../models/RecipeModel');
const RecipeController = require('../controllers/RecipeController');

/**
 * Get list of recipes based on user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
router.get('/', function(req, res, next) {
    try {
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
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

/**
 * Get list of recipes based on user profile after user registration
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
router.post('/find', function(req, res) {
    try {
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
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

/**
 * Add a recepie to user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
router.post('/addrecepie', async(req, res) => {
    try {
        var profileid = req.cookies.profile;

        let currentUser = await profileModel.findById(profileid);
        console.log('currentUser.recipes', currentUser.recipes);
        if (currentUser) {
            console.log('currentUser._id', currentUser._id);
            let recipeToAdd = await recipeModel.find({ rid: req.body.rid });

            console.log('recipeToAdd', recipeToAdd[0]._id);

            currentUser.recipes.push(recipeToAdd[0]._id);
            recipeToAdd[0].profiles.push(currentUser._id);
            await recipeToAdd[0].save();
            await currentUser.save();
            res.json(currentUser);
        } else {
            //user doesnt exist
        }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})

/**
 * Get recepies from user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
router.get('/myrecipes', async(req, res) => {
    try {
        var profileid = req.cookies.profile;
        let currentUser = await profileModel.findById(profileid).populate('recipes');
        if (currentUser) {
            for (let dish of currentUser.recipes) {
                console.log('dish', dish.rid);
            }
            res.render('myrecipes', { result: false, profile: '', dishes: currentUser.recipes });
        } else {
            //user doesnt exist
        }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})


/**
 * Calculate BMI and Caloris for user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
router.post('/calculate', async(req, res) => {
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



/**
 * Calculate BMR and Calories for user profile
 * @property {object} user  - UserProfile Model
 */
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
        case 'S':
            user.calories = Math.round(user.calories * 1.2);
            break;
        case 'L':
            user.calories = Math.round(user.calories * 1.375);
            break;
        case 'M':
            user.calories = Math.round(user.calories * 1.550);
            break;
        case 'V':
            user.calories = Math.round(user.calories * 1.725);
            break;
        case 'E':
            user.calories = Math.round(user.calories * 1.9);
            break;
    }

    switch (user.goal) {
        case 'weight-loss':
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
            user.ratio = '40% carbs / 40% protein / 20% fats'
            break;
        case 'maintenance':
            user.ccarbs = Math.round(user.carbratio * user.calories);
            user.cprotons = Math.round(user.protonratio * user.calories);
            user.cfats = Math.round(user.fatratio * user.calories);
            user.carbs = Math.round(user.carbratio * user.calories / 4);
            user.protons = Math.round(user.protonratio * user.calories / 4);
            user.fats = Math.round(user.fatratio * user.calories / 9);
            user.ratio = '40% carbs / 30% protein / 30% fats'
            break;
        case 'weight-gain':
            user.calories += 500;
            user.ccarbs = Math.round(user.carbratio * user.calories);
            user.cprotons = Math.round(user.protonratio * user.calories);
            user.cfats = Math.round(user.fatratio * user.calories);
            user.carbs = Math.round(user.carbratio * user.calories / 4);
            user.protons = Math.round(user.protonratio * user.calories / 4);
            user.fats = Math.round(user.fatratio * user.calories / 9);
            user.ratio = '40% carbs / 30% protein / 30% fats'
            break;
    }
    return user;
}

/**
 * Calculate BMI user profile
 * @property {object} user  - UserProfile Model
 */
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