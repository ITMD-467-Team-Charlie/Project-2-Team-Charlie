var express = require('express');
var router = express.Router();

/**
 * 
 */
router.get('/', function(req, res, next) {
    let usercookie = req.cookies.user;

    if (usercookie == null) { // Executes if variable is null OR undefined
        // do something
    } else {
        // do something else
    }
    res.render('home', { title: 'Nutrition Guide : Team Charlie Project' });
});

module.exports = router;