const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /positions
router.get('/', (req, res) => {
    if (req.session.username) {

        /* Get user_id from their username */
        /* username must be unique */
        const userId = await data.users.getUserIdFromUsername(req.session.username);

        // const stk_prt = await data.stockPortfolio.getSP(userId);

        // For testing:
        // const stk_prt = {
        //     stock: [ /* store stocks as nested array */
        //         ["GOOG", 10], /* min: 0. max: Number.MAX_SAFE_INTEGER - 1 */
        //         ["TSLA", 5],
        //         ["AAPL", 6],
        //         ["AMZN", 100]
        //     ]
        // };

        const stocks = [ /* store stocks as nested array */
            ["GOOG", 10], /* min: 0. max: Number.MAX_SAFE_INTEGER - 1 */
            ["TSLA", 5],
            ["AAPL", 6],
            ["AMZN", 100]
        ];

        res.render('../views/homePages/positions.handlebars',
            {
                title: 'Positions', user: 'TODO', str: 'hello', stocks: stocks, myList: ["a", "f", "g"]
            }
        );

    } else {
        res.redirect('/login');
    }
});

module.exports = router;