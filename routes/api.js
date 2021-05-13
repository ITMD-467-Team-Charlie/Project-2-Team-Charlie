const express = require('express');
const recepieRouter = require('./recepie');

const app = express();

app.use('/recepie/', recepieRouter);

module.exports = app;
