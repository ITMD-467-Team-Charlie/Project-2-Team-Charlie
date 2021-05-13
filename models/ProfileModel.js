'use strict';
const mongoose = require('mongoose');

const UserProfile = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  heightfeet: { type: Number, required: true },
  heightinch: { type: Number, required: true },
  weight: { type: Number, required: true },
  activity: { type: String, required: true },
  calories: { type: Number, required: true },
  bmi: { type: Number, required: true },
  goal: { type: String, required: true },
  carbs: { type: Number, required: true },
  protons: { type: Number, required: true },
  fats: { type: Number, required: true },
  ccarbs: { type: Number, required: true },
  cprotons: { type: Number, required: true },
  cfats: { type: Number, required: true },
  ratio: { type: String, required: true },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfile);
