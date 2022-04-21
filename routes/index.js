const signupRoutes = require('./account/signup');
const loginRoutes = require('./account/login');

const activityRoutes = require('./homePages/activity');
const positionsRoutes = require('./homePages/positions');
const tradeRoutes = require('./homePages/trade');

const constructorMethod = (app) => {
    // Home Page
    app.get('/', (req, res) => {
        if(req.session.username) {
            res.render('homePages/home.handlebars', {title: 'My Market Simulator', loggedIn: true, username: req.session.username});
        } else {
            res.render('account/login.handlebars', {title: 'Login', loggedIn: false});
        }
    });

    // Login and Signup Page
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);

    // Main Pages
    app.use('/activity', activityRoutes);
    // app.use('/home', homeRoutes);
    app.use('/positions', positionsRoutes);
    app.use('/trade', tradeRoutes); // ha

    // etc

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;