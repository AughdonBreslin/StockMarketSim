const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const stockPortData = data.stockPortfolio;
const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('homePages/settings.handlebars',
    {title: 'Change Settings', error: ''});
});

router.post('/', async (req, res) => {

    let changedPortUpdates = xss(req.body.changedPortUpdates);
    let minActBal = xss(req.body.minActBal);
    let insufficientFunds = xss(req.body.insufficientFunds);

    try {

        //For the checkboxes, there will always be one that is checked, so it will have to update.
        if (!changedPortUpdates) throw `Error: Portfolio Updates not defined!`;
        if (!insufficientFunds) throw `Error: Insufficient Fund Options not defined!`;

        validation.checkIsProper(changedPortUpdates, 'string', "Portfolio Updates");
        changedPortUpdates = changedPortUpdates.trim().toLowerCase();

        if (changedPortUpdates !== 'none' && changedPortUpdates !== 'hourly' && changedPortUpdates !== 'daily' && changedPortUpdates !== 'weekly' && changedPortUpdates !== 'monthly') {
            throw `Error: Not a valid email update option!`;
        }

        let numMinActBal;
        if (!minActBal || minActBal.trim().length == 0) {
            //Indicates to keep original number and to not update it
            numMinActBal = null;
        } else {
            numMinActBal = validation.checkMoneyAmt(minActBal, 'Minimum Account Balance', false);
        }

        const IFbool = validation.checkInsufficientFundOption(insufficientFunds);

        const userId = await userData.getUserIdFromUsername(req.session.username);

        const updatedUser = await userData.changePortUpdate(userId, changedPortUpdates);
        if (!updatedUser) throw `Error: Portfolio Updates couldn't be changed!`;

        const updatedStockPort = await stockPortData.changePortSettings(req.session.stockPortId, numMinActBal, IFbool);
        if (!updatedStockPort) throw `Error: Stock Portfolio settings couldn't be changed!`;

    } catch (e) {
        return res.status(400).render('homePages/settings.handlebars', {title: 'Change Settings', error: e});
    }

    try {
        return res.redirect('/');
    } catch (e) {
        return res.status(500).json({error: 'Internal Server Error'});
    }


});

router.get('/reset', async (req, res) => {
    res.render('homePages/reset.handlebars',
    {title: 'Reset Portfolio', error: ''});
});


router.post('/reset', async (req, res) => {

    //Delete portfolio - reset()
    req.session.stockPortId = null;

    try {
        return res.redirect('/createPortfolio');
    } catch (e) {
        return res.status(500).json({error: 'Internal Server Error'});   
    }
    
});

module.exports = router;