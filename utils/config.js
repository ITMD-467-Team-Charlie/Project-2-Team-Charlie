'use strict';
/**
 * Environment variables passed are stored here.
 * All of these are required except stated otherwise.
 *
 * @module environment
 */
require('dotenv').config();

/**
 * export config parameters.
 * @property {string} endpoint  - Endpoint to be called for nutrition API application
 * @property {string} key       - Token to pass when we're doing nutrition API calls on the backend
 * @property {string} id        - Id of the nutrition app (API)
 * @property {string} dburl     - Mongo DB connection URL string.
 * @property {string} secret    - Session secret string.
 * @property {string} testdb    - MongoDB test url.
 */
module.exports = {
  endpoint: process.env.END_POINT_URL,
  key: process.env.END_POINT_KEY,
  id: process.env.END_POINT_ID,
  dburl: process.env.MONGODB_URL,
  secret: process.env.SESSION_SECRET,
  testdb: process.env.TEST_MONGODB_URL
};
