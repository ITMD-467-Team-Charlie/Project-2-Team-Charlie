const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const profileRouter = require('./routes/profile');
// DB connection
const { MONGODB_URL } = process.env;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // don't show the log when it is test
  if (process.env.NODE_ENV !== 'test') {
    console.log('Connected to BD:', MONGODB_URL);
    console.log('App is running ... \n');
    console.log('Press CTRL + C to stop the process. \n');
  }
})
  .catch((err) => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });
const db = mongoose.connection;
const app = express();

app.use(session({ secret: 'XASDASDA' }));

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

app.use('/', profileRouter);
app.use('/api/', apiRouter);
app.use('/index', indexRouter);

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
});

module.exports = app;
