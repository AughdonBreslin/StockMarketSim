const express = require('express');
const router = express.Router();
const validation = require('../../validation');
const data = require('../../data');
const userData = data.users;
const stockPortData = data.stockPortfolio;

router.get('/', async (req, res) => {
    res.render('homePages/settings.handlebars',
    {title: 'Change Settings', error: ''});
});

router.post('/', async (req, res) => {
    


});

router.get('/reset', async (req, res) => {
    res.render('/homePages/reset.handelbars',
    {title: 'Reset Portfolio', error: ''});
});


router.post('/reset', async (req, res) => {

});