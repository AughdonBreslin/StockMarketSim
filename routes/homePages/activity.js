const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');

// GET /activity
router.get('/', async (req, res) => {
    if (req.session.username && req.session.stockPortId) {

        try {
            /* Get user_id from their username */
            /* username must be unique */
            const userId = await data.users.getUserIdFromUsername(req.session.username);

            // These comments can be deleted:
            // const stk_prt = await data.stockPortfolio.getSP(userId);
            // const transaction_ids = stk_prt.transactions;
            // For testing comment this later:
            // const transaction_ids = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439011"];

            const allUserTransactions = await data.transactions.getTransactions(req.session.stockPortId); /* list of objects */
            // console.log(JSON.stringify(allUserTransactions));

            // Get the deposit history - list of objs
            // const dep_hist = await data.depHist.getDepositsOfUser(req.session.stockPortId);
            // dep_hist = [];
            dep_hist = [
                {
                    "_id": "507f1f77bcf86cd799439011",

                    "deposit-amount": 400, /* min: 1 and max: Number.MAX_SAFE_INTEGER - 1 */
                    "manual-or-automated": true, /* false=automated deposite, true=manual */
                    "deposit-date": new Date(2021, 6, 12) /* store as new Date Object */
                },
                {
                    "_id": "507f1f77bcf86cd799439011",

                    "deposit-amount": 400, /* min: 1 and max: Number.MAX_SAFE_INTEGER - 1 */
                    "manual-or-automated": false, /* false=automated deposite, true=manual */
                    "deposit-date": new Date(2022, 2, 22) /* store as new Date Object */
                }
            ];

            // Get a list of the automated purchase/sell orders:
            // get awaitingTrades list
            // const automated_orders = await data.
            const automated_orders = [
                {
                    "_id": "507f1f77bcf86cd799439011",
                    "type": "buy", // Possible Values: ["buy", "sell"]
                    "ticker": "GOOG",
                    "quantity": 10,
                    "pps_threshold": 50.42,
                    "priority": 4 // Any positive number > 0
                },
                {
                    "_id": "507f1f77bcf86cd799439011",
                    "type": "sell", // Possible Values: ["buy", "sell"]
                    "ticker": "GOOG",
                    "quantity": 10,
                    "pps_threshold": 50.42,
                    "priority": -1 // Should always be -1 for sells
                }
            ];
            // const automated_orders = [];

            res.render('homePages/activity.handlebars',
                { title: 'Activity', user: 'TODO', transactions: allUserTransactions, deposits: dep_hist, awaitingTrades: automated_orders }

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