const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const stockPortData = data.stockPortfolio;
const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('account/createPort.handlebars',
      {title: 'Create Portfolio', error: ''});
  });
  
router.post('/', async (req, res) => {
  console.log(req.body);
  const initialDeposit = xss(req.body.initialDeposit);
  const autoDepFreq = xss(req.body.autoDepFreq);
  const autoDepAmt = xss(req.body.autoDepAmt);
  const minActBal = xss(req.body.minActBal);
  const insufficientFunds = xss(req.body.insufficientFunds);
  let error = '';
  let user = "";
  let newStockPort = "";
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

    if (!req.session.username) throw `Error: User not logged in!`;

    userID = await userData.getUserIdFromUsername(req.session.username);
    if (!userID) throw `Error: Getting user failed!`

    newStockPort = await stockPortData.createPortfolio(userID, numInitDep, tAutoDepFreq, numDepAmt, numMinActBal, IFBool);

    if (!newStockPort) throw `Error: Creating stock portfolio failed!`;

    newStockPort._id = newStockPort._id.toString();
    newStockPort.user_id = newStockPort.user_id.toString();
    req.session.stockPortId = newStockPort._id;

  } catch (e) {
    error = e;
    return res.status(400).render('account/createPort.handlebars', {title: 'Create Portfolio', error: error});
  }

  try {
    return res.redirect('/');
  } catch (e) {
    return res.status(500).json({error: 'Internal Server Error'});
  }

});
module.exports = router;