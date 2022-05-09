# StockMarketSim
CS546 Final Project

## Members:

Ella Crabtree, Aughdon Breslin, Christian Bautista, Ankit Patel

## GitHub URL:
[https://github.com/AughdonBreslin/StockMarketSim](https://github.com/AughdonBreslin/StockMarketSim)

## Setup:
Our project uses a number of dependencies, listed below. In order to start the project, do `npm i <package>` for every package listed below.
```
  "dependencies": {
    "axios": "^0.26.1",
    "bcrypt": "^5.0.1",
    "bcryptjs": "^2.4.3",
    "chart.js": "^3.7.1",
    "email-validator": "^2.0.4",
    "express": "^4.18.1",
    "express-handlebars": "^6.0.5",
    "express-session": "^1.17.2",
    "modules": "^0.4.0",
    "mongod": "^2.0.0",
    "mongodb": "^4.5.0",
    "node-cron": "^3.0.0",
    "node-schedule": "^2.1.0",
    "xss": "^1.0.11"
  }
```

After this, simply do `npm start` to launch the server, and then navigate to `http://localhost:3000/` on your web browser. 

If you would instead like to run the seed file, do `npm run seed` and you can work with the new user Bebo. His password is 'banana'. He does not have a portfolio yet, so upon login, you will be prompted to configure the settings of your portfolio.

NOTE: When using the website, please refrain from "rapid-clicking" as there have been error occurrences due to unfulfilled promises. I recommend giving about 2 seconds between clicks and waiting for the page to fully load/respond.