const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const transactionsData = data.transactions;
const xss = require('xss');
const transactions = require('../../data/transactions');

// GET /trade page
router.get('/', (req, res) => {
    if (req.session.username) {
        res.render('homePages/trade.handlebars',
            { title: 'Make A Trade', user: 'TODO' });
    } else {
        res.redirect('/login');
    }
});

// POST /trade (submit a trade)
/* When user makes a trade, post the transaction to /activity */
router.post('/', async (req, res) => {
    if (req.session.username) {

        try {
            // req.body:
            // ticker: ticker,                                   
            // quantity: quantity,                               
            // trans_opt: trans_opt,   'buy' or 'sell'          
            // trans_mode: trans_mode, 'automated' or 'manual'   
            // threshold: threshold,                             
            // priority: priority                                

            console.log("/trade route received a request to process!");

            const ticker = xss(req.body.ticker);
            validation.checkIsProper(ticker, "string", "Stock ticker");
            validation.checkString(ticker, 1, "Stock Ticker", true, false);
            if (ticker.length > 5) {
                throw `Error: Stock ticker cannot be greater than 5 characters!`;
            }

            let trans_opt = xss(req.body.trans_opt);
            if (!(trans_opt == "buy" || trans_opt == "sell")) {
                // bad data sent in request body
                throw `Error: Transaction type must be either 'buy' or 'sell'.`;
            }

            const quantity = parseInt(xss(req.body.quantity));
            validation.checkInt(quantity, "Quantity");

            const trans_mode = xss(req.body.trans_mode);
            console.log("trans_mode=" + trans_mode);

            if (!(trans_mode == "automated" || trans_mode == "manual")) {
                // bad data sent in request body
                throw `Error: Transaction mode must be either 'automated' or 'manual'.`;
            }

            let threshold = -1;
            let priority = -1;

            console.log("ticker=" + ticker);
            console.log("quantity=" + quantity);
            console.log("trans_opt=" + trans_opt);
            console.log("trans_mode=" + trans_mode);

            let retval;

            if (trans_mode == 'manual') {
                // make the manual trade call HERE

                if (trans_opt == "buy") {
                    retval = await transactions.buy(req.session.stockPortId, ticker, quantity, true, true);
                } else {
                    retval = await transactions.sell(req.session.stockPortId, ticker, quantity, true);
                }

            } else { /* automated - check transaction option */
                // if trans_mode == "automated", parse threshold
                // if trans_mode == "automated" and trans_opt == "buy", parse threshold and priority

                // parse threshold
                threshold = parseInt(xss(req.body.threshold));    /* get threshold */
                validation.checkIsProper(threshold, 'number', "Threshold Price");
                console.log("threshold=" + threshold);

                if (threshold < 0) {
                    throw `Error: The threshold price must be a positive amount`;
                }

                // if buy parse priority
                if (trans_opt == "buy") {
                    priority = parseInt(xss(req.body.priority));      /* get priority level */
                    validation.checkIsProper(priority, 'number', "Priority level");
                }
                console.log("priority=" + priority);

                // make the automated trade call HERE

                if (trans_opt == "buy") {
                    retval = await transactions.buy(req.session.stockPortId, ticker, quantity, true, true, threshold, priority, true);
                } else {
                    retval = await transactions.sell(req.session.stockPortId, ticker, quantity, true, threshold, true);
                }
            }

            /* Trade was successful */
            let str = ``;
            if (retval) {
                str += `Successfully `;

                if (retval.mode == 'manual') {
                    str += `executed trade`;
                } else {
                    str += `created trade order`;

                }
                str += ` to ${retval.type} ${retval.quantity} shares of ${retval.ticker}. Transaction amount: $${retval.total}.`;

            } else {
                str = `Error: Failed to make/create a trade. Please try again!`;
            }


            res.send(str);
            // return res.render('homePages/trade.handlebars',
            //     { title: 'Trade', user: 'TODO', trade_info: retval });

        } catch (error) {
            console.log(error);
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
