const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');
const transactions = require('../../data/transactions');

// GET /activity
router.get('/', async (req, res) => {
    if (req.session.username && req.session.stockPortId) {

        try {
            /* Get user_id from their username */
            /* username must be unique */
            let userID = await users.getUserIdFromUsername(req.session.username);
            userID = userID.toString();
            console.log(`User ${userID} went to home page.`);
            let portfolio = await stockPortfolio.getSP(req.session.stockPortId, userID);
            let depHist = portfolio.depositHistory;
            let transHist = portfolio.transactions;
            let autoTradeHist = portfolio.awaitingTrades;

            // Get a list of the automated purchase/sell orders:
            // get awaitingTrades list
            // const automated_orders = await data.
            // const automated_orders = [
            //     {
            //         "_id": "507f1f77bcf86cd799439011",
            //         "type": "buy", // Possible Values: ["buy", "sell"]
            //         "ticker": "GOOG",
            //         "quantity": 10,
            //         "pps_threshold": 50.42,
            //         "priority": 4 // Any positive number > 0
            //     },
            //     {
            //         "_id": "507f1f77bcf86cd799439011",
            //         "type": "sell", // Possible Values: ["buy", "sell"]
            //         "ticker": "GOOG",
            //         "quantity": 10,
            //         "pps_threshold": 50.42,
            //         "priority": -1 // Should always be -1 for sells
            //     }
            // ];
            // const automated_orders = [];

            res.render('homePages/activity.handlebars',
                { title: 'Activity', user: 'TODO', transactions: transHist, deposits: depHist, awaitingTrades: autoTradeHist }

            );

        } catch (error) {
            res.render('additional/error.handlebars',
                {
                    title: 'Error', errorMessage: error.toString()
                }
            );
        }

    } else {
        res.redirect('/login');
    }
});

module.exports = router;