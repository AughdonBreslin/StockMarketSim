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
            console.log(`User ${userID} went to activity page.`);
            let portfolio = await stockPortfolio.getSP(req.session.stockPortId, userID);
            let depHist = portfolio.depositHistory;
            let transHist = portfolio.transactions;
            let autoTradeHist = portfolio.awaitingTrades;

            res.render('homePages/activity.handlebars', {
                title: 'Activity',
                transactions: transHist,
                deposits: depHist,
                awaitingTrades: autoTradeHist
            });

        } catch (error) {
            res.render('additional/error.handlebars',
                {
                    title: 'Error',
                    errorMessage: error.toString()
                }
            );
        }

    } else {
        res.redirect('/login');
    }
});

module.exports = router;