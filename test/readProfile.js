const assert = require('assert');
const Profile = require('../models/ProfileModel');
let user;
beforeEach(() => {
    user = new Profile({ 
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
    user.save()
        .then(() => done());
});

describe('Reading UserProfile details', () => {
    
    it( "should successfully fetch user profile by name", () =>
    {
        Profile.findOne({ name: 'test profile' }).then( ( result ) =>
        {
            if( result ) {
                assert(result.name === 'test profile');
                return Promise.resolve();
            } else {
                return Promise.reject( "cannot save" );
            }
        }).catch( ( e ) =>
        {
            return Promise.reject( e );
        });
    });
})