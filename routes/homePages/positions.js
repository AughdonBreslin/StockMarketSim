const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');

const stockPortfolio = require('../../data/stockPortfolio');
const users = require('../../data/users');
const api = require('../../data/api');
const xss = require('xss');
const { response } = require('express');

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
            stocks.forEach( (event) => {
                event.push(`/positions/${event[0]}`);
            })

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

router.get('/:stock', async (req, res) => {
    console.log('hello');
    console.log(req.params.stock);
    const stockTicker = xss(req.params.stock);
    console.log(stockTicker);
    const prices = await api.dailyHistory(stockTicker);
    console.log('hello');
    res.json(prices);
});

module.exports = router;