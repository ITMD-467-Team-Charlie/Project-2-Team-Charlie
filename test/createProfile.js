//inside create_test.js
const assert = require('assert');
const Profile = require('../models/ProfileModel'); //imports the USerProfile model.
describe('Creating User Profile', () => {
    it('should successfully create a user profile', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        let user = new Profile({ 
                name: 'test profile',
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
        user.save().then(() => {
                assert(!user.isNew); //if user is saved to db it is not new
                done();
            });
    });
});