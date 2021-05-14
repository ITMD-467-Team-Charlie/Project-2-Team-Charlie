//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const assert = require('assert');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const { expect } = require('chai')


chai.use(chaiHttp);
//Our parent block
describe('Recipe API', () => {
/*
  * Test the /GET route
  * https://localhost:3000/api/recipe?q=&from=0&to=2
  */
  describe('/GET recipes', () => {
      it('API should GET the recipes', (done) => {
        chai.request(server)
            .get('/api/recipe?q=&from=0&to=2')
            .end((err, res) => {
                  res.should.have.status(200);
                  assert(res.body.status === 'success'); // check for status message
                  assert(res.body.data.length === 2); // should get two records
              done();
            });
      });
  });
});


// Testing the profile analyse expecting status 200 of success and valid BMI and BMR values
describe('POST /calculate', function() {
    it('analyze user profile', function(done) {
        chai.request(server)
        .post('/calculate')
        .type('form')
        .send({ 
                'name': 'test profile',
                'age': '35',
                'sex': 'M',
                'heightfeet': '5',
                'heightinch': '8',
                'weight': '80',
                'activity': 'S'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          expect(res.text).to.be.a('string');
          expect(res.text).to.include('your BMI is 12.'); // check if BMI is calculated correctly
          expect(res.text).to.include('TOTAL CALORIES: 2027'); // checck if BMR is calculated correctly
          done();
        });
    });
  });
