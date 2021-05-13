'use strict';
/**
 * This is the nutritionguide application module.
 *
 * @module app
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const configs = require('./utils/config');
// setup DB connection
require('./db/connect');
const apiRouter = require('./routes/api');
const profileRouter = require('./routes/profile');
const recipeRouter = require('./routes/recipe');

const app = express();

app.use(session({ secret: configs.secret }));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// To allow cross-origin requests
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// app routes
app.use('/', profileRouter);
app.use('/details/', recipeRouter);
app.use('/api/', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
});

module.exports = app;
