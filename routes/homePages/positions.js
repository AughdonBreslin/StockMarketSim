const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');

const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');

// GET /positions
router.get('/', async (req, res) => {
    if (req.session.username) {
        try {
            /* Get user_id from their username */
            /* username must be unique */
            let userID = await users.getUserIdFromUsername(req.session.username);
            userID = userID.toString();
            console.log(`User ${userID} went to home page.`);
            portfolio = await stockPortfolio.getSP(req.session.stockPortId, userID);
            let stocks = portfolio.stocks;

            // For testing comment this later:

            // [ /* store stocks as nested array */
            //     ["GOOG", 10], /* min: 0. max: Number.MAX_SAFE_INTEGER - 1 */
            //     ["TSLA", 5],
            //     ["AAPL", 1],
            //     ["AMZN", 100]
            // ];

            // throw "test message";
            res.render('../views/homePages/positions.handlebars',
                {
                    title: 'Positions',
                    user: req.session.username,
                    stocks: stocks
                }
            );
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