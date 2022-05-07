const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /activity
router.get('/', async (req, res) => {
    if (req.session.username && req.session.stockPortId) {

        try {
            // console.log("activities");

            /* Get user_id from their username */
            /* username must be unique */
            const userId = await data.users.getUserIdFromUsername(req.session.username);

            // uncomment this
            // const stk_prt = await data.stockPortfolio.getSP(userId);

            // const transaction_ids = stk_prt.transactions;
            // For testing comment this later:
            const transaction_ids = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439011"];

            const allUserTransactions = await data.transactions.getTransactions(transaction_ids); /* list of objects */
            // console.log(JSON.stringify(allUserTransactions));

            res.render('homePages/activity.handlebars',
                { title: 'Activity', user: 'TODO', transactions: allUserTransactions });

        } catch (error) {
            res.render('homePages/error.handlebars',
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