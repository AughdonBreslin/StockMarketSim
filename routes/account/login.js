const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /login
router.get('/', async (req, res) => {
    res.render('account/login.handlebars',
      {title: 'Login', error: ''});
    return;
});

// POST /login
router.post('/', async (req, res) => {
    const {username, password} = req.body;
    let status = {user: null, authenticated: false};
    let error = '';

    // Check that username and password are supplied in the req.body
    try {

      if (!username) throw 'Error: Username not specified!';
      if (!password) throw 'Error: Password not specified!';

      validation.checkIsProper(username, 'string', 'Username');
      validation.checkString(username, 4, 'username', true, false);
      validation.checkIsProper(password, 'string', 'Password');
      validation.checkString(password, 6, 'password', false, false);

      status = await userData.checkUser(username.trim(),password.trim());
      if(!status || !status.authenticated) throw `Error: Invalid credentials.`;
      const tUsername = username.trim();
      req.session.username = tUsername;
      req.session.userId = status.user._id;
    } catch (e) {
      //  Render the login screen once again, and this time showing an error message (along with an HTTP 400 status code) to the user explaining what they had entered incorrectly.
      error = e;
      return res.status(400).render('account/login.handlebars', {title: 'Login', error: error});
    }
    try {
      return res.redirect('/');
    } catch (e) {
      return res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
