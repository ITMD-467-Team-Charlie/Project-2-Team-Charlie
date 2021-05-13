const express = require('express');

const router = express.Router();

/**
 *
 */
router.get('/', (req, res, next) => {
  const usercookie = req.cookies.user;

  if (usercookie == null) { // Executes if variable is null OR undefined
    // do something
  } else {
    // do something else
  }
  res.render('home', { title: 'Nutrition Guide : Team Charlie Project' });
});

module.exports = router;
