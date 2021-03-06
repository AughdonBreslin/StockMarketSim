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
    },

    // basic multiplication 
    multiply: (num1, num2) => {
      return num1 * num2;
    },

    // map transaction types to words. 'Purchase' = 'bought' and 'sell' = 'sold'
    action: (type) => {
      return type == "buy" ? "bought" : "sold";
    },

    // If value == 1, return the singular form. Else return the plural form
    plural: (value, single, plural) => {
      return value == 1 ? single : plural;
    },

    // sell once a stock 'reaches' a set price and buy once a stock 'falls to' a certain price.
    direction: (type) => {
      return type == "sell" ? "reaches" : "falls to";
    },

    // If automated trade type is a purchase, return its priority.
    prio_msg: (type, prio) => {
      return type == "sell" ? "" : `Priority: ${prio}`;
    },

    /* true=manual deposit, false=automated deposit*/
    isManual: (isManDep) => {
      return isManDep ? "manually" : "automatically";
    },

    // trade_conf_msg: (trade_info_obj) => {
    //   let str = ``;
    //   if (trade_info_obj.auth) {
    //     str += `Successfully `;

    //     if (trade_info_obj.mode == 'manual') {
    //       str += `executed trade`;
    //     } else {
    //       str += `created trade order`;

    //     }
    //     str += ` to ${trade_info_obj.type} ${trade_info_obj.quantity} shares of ${trade_info_obj.ticker}. Transaction amount: $${trade_info_obj.cost}.`;

    //   } else {
    //     str = `Error: Failed to make/create a trade. Please try again!`;
    //   }
    //   return str;
    // },

    isDeposit: (isDep) => {
      return (isDep == "Deposit") ? "deposited" : "withdrawn";
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
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

/*************************
 ***      Routing      ***
 *************************/
app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don\'t tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 600000 }
  })
);

/*************************
 ***      Middlewares      ***
 *************************/

// User is logged in and trying to access login/signup pages
app.use('/signup', (req, res, next) => {
  if (req.session.username && req.session.stockPortId) {
    return res.redirect('/');
  } else if (req.session.username && !req.session.stockPortId) {
    // req.method = 'GET';
    return res.redirect('/createPortfolio')
  } else {
    next();
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.username && req.session.stockPortId) {
    return res.redirect('/');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

// User has already created a portfolio and trying to access it again
app.use('/createPortfolio', (req, res, next) => {
  if (req.session.username && req.session.stockPortId) {
    return res.redirect('/');
  } else if (!req.session.username) {
    return res.redirect('/login');
  } else {
    next();
  }
});

app.use('/activity', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

app.use('/positions', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

app.use('/trade', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

app.use('/settings', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

app.use('/settings/reset', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
});

app.use('/logout', (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  } else if (req.session.username && !req.session.stockPortId) {
    return res.redirect('/createPortfolio');
  } else {
    next();
  }
})




/*************************
 ***      Booting      ***
 *************************/
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});