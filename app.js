const express = require("express");
const app = express();
const session = require("express-session");
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request"s method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use;
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

/*************************
 ***      Routing      ***
 *************************/
app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don\"t tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: 600000}
  })
);

// User is logged in and trying to access login/signup pages
app.use('/signup', (req, res, next) => {
  if (req.session.username) {
    return res.redirect('/');
  } else {
    // req.method = 'GET';
    next();
  }
});
app.use('/login', (req, res, next) => {
  if (req.session.username) {
    return res.redirect('/');
  } else {
    // req.method = 'GET';
    next();
  }
});

/*************************
 ***      Booting      ***
 *************************/
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
