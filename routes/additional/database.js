const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const { response } = require('express');
const { ObjectId } = require('mongodb');

const xss = require('xss');

const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');

// POST /database page
router.post('/', async (req, res) => {
    let portBal = xss(req.body.portBal);
    let quantVal = xss(req.body.quantVal);
    let option = xss(req.body.option);
    let portfolio = {}
    try {
        userID = await users.getUserIdFromUsername(req.session.username);
        userID = userID.toString();
        console.log(`User ${userID} posted data.`);
        portfolio = await stockPortfolio.updateCurrentBal(req.session.stockPortId, userID, portBal);
        let updatedPort = await stockPortfolio.addToDepHist(req.session.stockPortId, userID, {
            _id: new ObjectId(),
            option: option,
            deposit_amount: quantVal,
            manual: true,
            deposit_date: new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
        })
        console.log(updatedPort.depositHistory);
    } catch (e) {
        console.log(e);
    }

    res.json({success: true, message: portfolio.balance})
});

module.exports = router;