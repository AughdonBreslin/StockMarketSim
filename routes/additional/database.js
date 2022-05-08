const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const { response } = require('express');
const xss = require('xss');

const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');

// POST /database page
router.post('/', async (req, res) => {
    let portBal = xss(req.body.portBal);
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