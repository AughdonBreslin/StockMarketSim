const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /positions
router.get('/', async (req, res) => {
    if (req.session.username) {
        try {
            /* Get user_id from their username */
            /* username must be unique */
            const userId = await data.users.getUserIdFromUsername(req.session.username);

            // uncomment this 
            // const stk_prt = await data.stockPortfolio.getSP(userId);
            // const stocks = stk_prt.stocks;

            // For testing comment this later:
            const stocks = [ /* store stocks as nested array */
                ["GOOG", 10], /* min: 0. max: Number.MAX_SAFE_INTEGER - 1 */
                ["TSLA", 5],
                ["AAPL", 1],
                ["AMZN", 100]
            ];

            // throw "test message";
            res.render('../views/homePages/positions.handlebars',
                {
                    title: 'Positions', user: 'TODO', stocks: stocks
                }
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