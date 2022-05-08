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
            res.render('homePages/home.handlebars',
                {
                    title: 'My Market Simulator',
                    username: req.session.username,
                    percentChange: "TODO",
                    balance: portfolio.balance,
                    value: "TODO"
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
    app.get('/logout', (req, res) => {
        if(req.session.username) {
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