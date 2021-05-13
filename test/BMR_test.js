const assert = require('assert');
const calculateBMR = require('../controllers/ProfileController').calculateBMR;

describe('ProfileController', function () {


    it('calculateBMR should succesfully calculate the BMR', function () {
        let user = new Profile({
            name: 'test BMR profile',
            age: 35,
            sex: 'M',
            heightfeet: 5,
            heightinch: 8,
            weight: 80,
            activity: 'S',
            goal: 'weight-loss',
            ratio: '40% carbs / 40% protein / 20% fats',
            bmi: 27,
            calories: 2000,
            ccarbs: 200,
            cprotons: 300,
            cfats: 120,
            carbs: 110,
            protons: 200,
            fats: 90
        });



    })
});
