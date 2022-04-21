
const constructorMethod = (app) => {
    // Home Page
    app.get('/', (req, res) => {
        if(req.session.username) {
            res.render('homePages/home.handlebars', {title: 'My Market Simulator'});
        } else {
            res.render('account/login.handlebars', {title: "Login"});
        }
    });

    // Login and Signup Page
    app.get('/login', (req, res) => {
        res.render('account/login.handlebars', {title: "Login"});
    })
    app.get('/signup', (req, res) => {
        res.render('account/signup.handlebars', {title: "Sign Up"});
    })
    // Trade Page

    // View Portfolio Page

    // etc

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;