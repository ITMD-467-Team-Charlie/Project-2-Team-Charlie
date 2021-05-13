'use strict';
const mongoose = require('mongoose');

const Recipe = new mongoose.Schema({
  uri: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  rid: { type: String, required: true },
  yield: { type: Number, required: true },
  calories: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
  dietLabels: { type: Array },
  healthLabels: { type: Array },
  cautions: { type: Array },
  ingredientLines: { type: Array },
  cuisineType: { type: Array },
  mealType: { type: Array },
  totalNutrients: { type: Array },
  totalDaily: { type: Array },
  digest: { type: Array },
  fat: { type: Number },
  carb: { type: Number },
  protein: { type: Number },
  fatr: { type: Number },
  carbr: { type: Number },
  protiner: { type: Number },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', Recipe);
