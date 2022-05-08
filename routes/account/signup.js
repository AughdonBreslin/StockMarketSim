const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /signup
router.get('/', async (req, res) => {
    res.render('account/signup.handlebars',
      {title: 'Signup', error: ''});
});

// POST /signup
router.post('/', async (req, res) => {
  console.log('I got to post');
    const {fullname, email, username, password, portUpdates} = req.body;
    let status = {userInserted: false};
    let error = '';
    
    // Check that username and password are supplied in the req.body
    try {

      //Check if all information has been supplied
      if (!fullname) throw `Error: Full name not specified!`
      if (!email) throw `Error: Email address not specified!`
      if (!username || !password) throw `Error: Username and/or password not specified!`
      if (!portUpdates) throw `Error: Email Update setting not specified!`

      //Checking if arguments are of appropriate type
      validation.checkIsProper(fullname, 'string', 'First name');
      validation.checkIsProper(email, 'string', 'Email');
      validation.checkIsProper(username, 'string', 'username');
      validation.checkIsProper(password, 'string', 'password');
      validation.checkIsProper(portUpdates, 'string', 'Email updates');

      //Trim strings + toLowerCase - Formatting
      let tFullName = fullname.trim();

      let tEmail = email.trim();
      tEmail = tEmail.toLowerCase();

      let tUsername = username.trim();
      tUsername = tUsername.toLowerCase();

      let tPassword = password.trim();
    
      let tPortUpdates = portUpdates.trim();
      tPortUpdates = tPortUpdates.toLowerCase();

      //Check if email update selection is a valid selection
      if (tPortUpdates !== 'none' && tPortUpdates !== 'daily' && tPortUpdates !== 'weekly' && tPortUpdates !== 'monthly') {
          throw `Error: Not a valid email update option!`;
      }

      // NOTE: Check usernames with spaces/non-alphanumeric characters
      validation.checkString(tUsername, 4, 'username', true, false);
    
      // NOTE: Check passwords with length < 6
      validation.checkString(tPassword, 6, 'password', false, false);

      //Check if email is a valid address (throw errors if otherwise)
      validation.checkEmail(tEmail);
      
      status = await userData.createUser(tFullName, tEmail, tUsername, tPassword, tEmailUpdates);
    } catch (e) {
      error = e;
      //  Render the sign-up screen once again, and this time showing an error message (along with an HTTP 400 status code) to the user explaining what they had entered incorrectly.
      return res.status(400).render('account/signup.handlebars', {title: 'Signup', error: error});
    }
    try {
      if(!status || !status.userInserted) throw `Error: Could not add new user.`;
      return res.redirect('/login');
    } catch (e) {
      return res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
