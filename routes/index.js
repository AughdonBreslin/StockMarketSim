const signupRoutes = require('./signup');
const loginRoutes = require('./login');

const constructorMethod = (app) => {
    // Home Page
    app.get('/', (req, res) => {
        if(req.session.username) {
            res.render('homePages/home.handlebars', {title: 'My Market Simulator', username: req.session.username});
        } else {
            res.render('account/login.handlebars', {title: 'Login', error:'Please login first.'});
        }
    });

    // Login and Signup Page
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);

    // Trade Page
    app.get('/', (req, res) => {
        if(req.session.username) {
            res.render('homePages/trade.handlebars', {title: 'Trade', user: 'TODO'});
        } else {
            res.render('account/login.handlebars', {title: 'Login', error: 'Please login first.'});
        }
    });    // View Portfolio Page

    // etc

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;