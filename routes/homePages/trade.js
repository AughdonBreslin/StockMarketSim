const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const transactionsData = data.transactions;

// GET /trade
router.get('/', (req, res) => {
    if(req.session.username) {
        res.render('homePages/trade.handlebars',
            {title: 'Trade', user: 'TODO'});
        } else {
            res.redirect('/login');
        }
});


/* When user makes a trade, post the transaction to /activity */
router.post('/', async (req, res) => {
    if(req.session.username) {
        // Check if user wants to sell or buy stocks.
        const act = req.body.buy || req.body.sell; /* true = buy and false = sell. */


        // Parse rest of the inputs:
        // buy(id, ticker, quant)
        // sell(id, ticker, quant)

        const stkport_id = 0;
        const ticker = req.body.ticker;
        const quant = req.body.quant;

        let trade_ack;

        if(act) {
            trade_ack = await transactionsData.buy(stkport_id, ticker, quant);
        } else {
            trade_ack = await transactionsData.sell(stkport_id, ticker, quant);
        }

        res.render('homePages/trade.handlebars',
            {title: 'Trade', user: 'TODO', trans_log: trade_ack});
        } else {
            res.redirect('/login');
        }
});
module.exports = router;
