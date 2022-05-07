const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const stockPortData = data.stockPortfolio;

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
      req.session.firstLogIn = status.user.firstTimeLogIn;
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

router.get('/createPortfolio', async (req, res) => {
  res.render('account/creatPort.handlebars',
    {title: 'Create Portfolio', error: ''});
});

router.post('/createPortfolio', async (req, res) => {
  const {initialDeposit, autoDepFreq, autoDepAmt, minActBal, insufficientFunds} = req.body;
  let error = '';
  let user = null;
  let status = null;

  try {

    //Checking if all information is supplied
    if (!initialDeposit) throw `Error: Initial Deposit not defined!`;
    if (!autoDepFreq) throw `Error: Auto Deposit Frequency not defined!`;
    if (!autoDepAmt) throw `Error: Auto Deposit Amount not defined!`;
    if (!minActBal) throw `Error: Minimum Account Balance not defined`;
    if (!insufficientFunds) throw `Error: Insufficient funds option not defined!`;

    validation.checkIsProper(initialDeposit, 'string', 'Initial Deposit Amount');
    validation.checkIsProper(autoDepAmt, 'string', 'Automatic Deposit Amount');
    validation.checkIsProper(minActBal, 'string', 'Minimum Account Balance');
    

    let numInitDep = validation.checkMoneyAmt(initialDeposit.trim(), 'Initial Deposit', false);
    let numDepAmt = validation.checkMoneyAmt(autoDepAmt.trim(), 'Automatic Deposit Amount', false);
    let numMinActBal = validation.checkMoneyAmt(minActBal.trim(), 'Minimum Account Balance', false);
    let tAutoDepFreq = validation.checkAutoDepFreq(autoDepFreq);
    let IFBool = validation.checkInsufficientFundOption(insufficientFunds);

    if (!req.session.userId) throw `Error: User not logged in!`;

    user = await userData.getUser(req.session.userId);
    if (!user) `Error: Getting user failed!`

    status = await stockPortData.createPortfolio(req.session.userId, numInitDep, tAutoDepFreq, numDepAmt, numMinActBal, IFBool);


  } catch (e) {

  }

});

module.exports = router;
