const express = require('express');
const router = express.Router();
const validation = require('../validation');
const data = require('../data');
const userData = data.users;

// GET /signup
router.get('/', async (req, res) => {
    res.render('account/signup.handlebars', {title: "Signup", error: ""});
});

// POST /signup
router.post('/', async (req, res) => {
    const userInfo = req.body;
    let status = {userInserted: false};
    // Check that username and password are supplied in the req.body
    try {
      validation.checkIsProper(userInfo.username, 'string', 'Username');
      validation.checkString(userInfo.username, 4, 'username', true, false);
      validation.checkIsProper(userInfo.password, 'string', 'Password');
      validation.checkString(userInfo.password, 6, 'password', false, false);
      const {username,password} = userInfo;
      status = await userData.createUser(username,password);
    } catch (e) {
      //  Render the sign-up screen once again, and this time showing an error message (along with an HTTP 400 status code) to the user explaining what they had entered incorrectly.
      return res.status(400).render('account/signup.handlebars', {title: "Signup", error: e});
    }
    try {
      if(!status || !status.userInserted) throw `Error: Could not add new user.`;
      return res.redirect('/login');
    } catch (e) {
      return res.status(500).json({error: "Internal Server Error"});
    }
});

module.exports = router;
