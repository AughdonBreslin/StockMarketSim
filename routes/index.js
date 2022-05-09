const signupRoutes = require('./account/signup');
const loginRoutes = require('./account/login');
const createPortRoutes = require('./account/createPort');

const activityRoutes = require('./homePages/activity');
const positionsRoutes = require('./homePages/positions');
const tradeRoutes = require('./homePages/trade');
const settingsRoutes = require('./homePages/settings');
const databaseRoutes = require('./additional/database');

const stockPortfolio = require('../data/stockPortfolio');
const users = require('../data/users');
const cron = require('node-schedule');
const api = require('../data/api');

const constructorMethod = (app) => {
    // Home Page
    app.get('/', async (req, res) => {
        if(req.session.username && req.session.stockPortId) {
            let userID = ""
            let portfolio = {}
            try {
                userID = await users.getUserIdFromUsername(req.session.username);
                userID = userID.toString();
                console.log(`User ${userID} went to home page.`);
                portfolio = await stockPortfolio.getSP(req.session.stockPortId, userID);
            } catch (e) {
                console.log(e);
            }

            // get previous days' portfolio value and current portfolio value
            api.updateDailyValues(req.session.stockPortId);
            const prevPVal = portfolio["dailyValues"][portfolio["dailyValues"].length-1][1];
            const currPVal = api.pval(req.session.stockPortId);
            let percent = ((currPVal - prevPVal) / prevPVal) * 100;
            percent = percent.toFixed(2);
            
            res.render('homePages/home.handlebars',
                {
                    title: 'My Market Simulator',
                    username: req.session.username,
                    percentChange: `${percent}`,
                    balance: portfolio.balance,
                    value: portfolio.value
                });
        } else if (req.session.username) {
            res.redirect('/createPortfolio');
        } else {
            res.redirect('/login');
        }
    });    

    // Login and Signup Page
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);
    app.use('/createPortfolio', createPortRoutes);

    // Main Pages
    app.use('/activity', activityRoutes);
    app.use('/positions', positionsRoutes);
    app.use('/trade', tradeRoutes); // ha
    app.use('/settings', settingsRoutes);
    // etc

    app.use('/database', databaseRoutes);


    // User is logged in and is not having it
    app.get('/logout', async (req, res) => {
        if(req.session.username) {
            cron.gracefulShutdown();
            userID = await users.getUserIdFromUsername(req.session.username);
            userID = userID.toString();
            console.log(`User ${userID} logged out.`);
            req.session.destroy(function (err) {
                res.render('account/login.handlebars', {title: "You've been logged out."});
            });
        } else {
            res.redirect('/');
        }
    });

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;