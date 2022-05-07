const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;

// GET /activity
router.get('/', async (req, res) => {
    if (req.session.username) {

        /* Get user_id from their username */
        /* username must be unique */
        const userId = await data.users.getUserIdFromUsername(req.session.username);

        // uncomment this
        // const stk_prt = await data.stockPortfolio.getSP(userId);

        // const transaction_ids = stk_prt.transactions;
        // For testing comment this later:
        const transaction_ids = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439011"];

        const allUserTransactions = data.transactions.getTranactionObjects(transaction_ids);

        res.render('homePages/activity.handlebars',
            { title: 'Activity', user: 'TODO', transactions: allUserTransactions });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;