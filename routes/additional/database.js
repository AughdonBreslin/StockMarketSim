const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const { response } = require('express');
const userData = data.users;
const portData = data.portfolios;

const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');

// POST /database page
router.post('/', async (req, res) => {
    let portBal = req.body.portBal;
    let portfolio = {}
    try {
        userID = await users.getUserIdFromUsername(req.session.username);
        userID = userID.toString();
        console.log(`User ${userID} posted data.`);
        portfolio = await stockPortfolio.updateCurrentBal(req.session.stockPortId, userID, portBal);
    } catch (e) {
        console.log(e);
    }

    res.json({success: true, message: portfolio.balance})
});

module.exports = router;