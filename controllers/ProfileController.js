'use strict';
/**
 * Controller for processing user profile requests
 *
 * @module profileController
 */
const mongoose = require('mongoose');

const ProfileModel = mongoose.model('UserProfile');
const RecipeModel = mongoose.model('Recipe');
const RecipeController = require('./RecipeController');

let user = {};
/**
 * Calculate BMR and Calories for user profile
 * @property {object} user  - UserProfile Model
 */
function calculateBMR() {
  user.carbratio = 0.4;
  user.protonratio = 0.3;
  user.fatratio = 0.3;

  const height = ((user.heightfeet * 30.48) + (user.heightinch * 2.54));
  if (user.sex === 'M') {
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
  default:
    break;
  }

  switch (user.goal) {
  case 'weight-loss':
    user.carbratio = 0.4;
    user.protonratio = 0.4;
    user.fatratio = 0.2;
    if (user.calories <= 2000) user.calories = Math.round(0.9 * user.calories);
    if (user.calories > 2000) user.calories = Math.round(0.8 * user.calories);
    user.ratio = '40% carbs / 40% protein / 20% fats';
    break;
  case 'maintenance':
    user.ratio = '40% carbs / 30% protein / 30% fats';
    break;
  case 'weight-gain':
    user.calories += 500;
    user.ratio = '40% carbs / 30% protein / 30% fats';
    break;
  default:
    break;
  }

  user.ccarbs = Math.round(user.carbratio * user.calories);
  user.cprotons = Math.round(user.protonratio * user.calories);
  user.cfats = Math.round(user.fatratio * user.calories);
  user.carbs = Math.round((user.carbratio * user.calories) / 4);
  user.protons = Math.round((user.protonratio * user.calories) / 4);
  user.fats = Math.round((user.fatratio * user.calories) / 9);
}

/**
 * Calculate BMI user profile
 * @property {object} user  - UserProfile Model
 */
function calculateBMI() {
  const totalfeethight = (user.heightfeet * 0.3048) + (user.heightinch * 0.0254);
  let bmivalue = user.weight / (totalfeethight * totalfeethight);
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
}

/**
 * Get list of recipes based on user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
exports.userRecipeList = function getrecipelist(req, res) {
  try {
    const usercookie = req.cookies.profile;
    if (typeof usercookie === 'undefined') { // Executes if variable is null OR undefined
      res.render('profile', { result: false, user: '', title: 'Nutrition Guide : Team Charlie Project' });
    } else if (req.session.user !== 'undefined' && req.session.user !== null) {
      RecipeController.recipeListPage(req, res, req.session.user);
    } else {
      console.log('fetch from db');
      // get user profile from DB and save in session
      ProfileModel.findById(usercookie, (err, profile) => {
        if (err) {
          return console.log('error when fetching profile:', err);
        }
        if (profile) {
          const profileData = {
            id: profile._id,
            name: profile.name,
            age: profile.age,
            sex: profile.sex,
            heightfeet: profile.heightfeet,
            heightinch: profile.heightinch,
            weight: profile.weight,
            activity: profile.activity,
            goal: profile.goal,
            ratio: profile.ratio,
            bmi: profile.bmi,
            calories: profile.calories,
            ccarbs: profile.ccarbs,
            cprotons: profile.cprotons,
            cfats: profile.cfats,
            carbs: profile.carbs,
            protons: profile.protons,
            fats: profile.fats,
            recipes: profile.recipes
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
};

/**
 * Get list of recipes based on user profile after user registration
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
exports.saveProfile = function saveprofile(req, res) {
  try {
    const userprofile = new ProfileModel(req.session.user);
    res.cookie('profile', userprofile._id, {
      maxAge: 365 * 24 * 60 * 60 * 1000 // 24 hours
    });
    // save user
    userprofile.save((err) => {
      if (err) {
        return console.log('Error while saving profile to DB:', err);
      }
    });
    RecipeController.recipeListPage(req, res, userprofile);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

/**
 * Add a recepie to user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
exports.saveRecepie = async function saverecepie(req, res) {
  try {
    const profileid = req.cookies.profile;
    const currentUser = await ProfileModel.findById(profileid);
    if (currentUser) {
      const recipeToAdd = await RecipeModel.find({ rid: req.body.rid });
      console.log('recipeToAdd', recipeToAdd[0]._id);
      if(!currentUser.recipes.includes(recipeToAdd[0]._id)){
        currentUser.recipes.push(recipeToAdd[0]._id);
        recipeToAdd[0].profiles.push(currentUser._id);
        await recipeToAdd[0].save();
        await currentUser.save();
      }
      res.json(currentUser);
    } else {
      // user doesnt exist
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

/**
 * Get recepies from user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
exports.savedRecepies = async function savedrecepies(req, res) {
  try {
    const profileid = req.cookies.profile;
    const currentUser = await ProfileModel.findById(profileid).populate('recipes');
    if (currentUser) {
      res.render('myrecipes', { result: false, profile: '', dishes: currentUser.recipes });
    } else {
      // user doesnt exist
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

/**
 * Calculate BMI and Calories for user profile
 * @property {object} req - request object.
 * @property {object} res- response object.
 */
exports.analyzeProfile = function analyze(req, res) {
  try {
    user = {
      name: req.body.name,
      age: req.body.age,
      sex: req.body.sex,
      heightfeet: req.body.heightfeet,
      heightinch: req.body.heightinch,
      weight: req.body.weight * 0.45359237, // convert to kgs
      activity: req.body.activity
    };

    calculateBMI();
    calculateBMR();

    req.session.user = user;
    res.render('profile', { result: true, user });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
