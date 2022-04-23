const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /positions
router.get('/', (req, res) => {
    if(req.session.username) {
        res.render('homePages/positions.handlebars',
            {title: 'Positions', loggedIn: true, user: 'TODO'});
        } else {
            res.redirect('/login');
        }
});

module.exports = router;