var express = require('express');
var router = express.Router();

/**
 * 
 */
router.get('/', function (req, res, next) {
    let usercookie = req.cookies.user;

    if (usercookie == null) { // Executes if variable is null OR undefined
        res.cookie('user', 'test', {
            maxAge: 86400 * 1000 // 24 hours
        });
    } else {
        // do something else
    }
    res.render('home', { title: 'Nutrition Guide : Team Charlie Project' });
});

module.exports = router;