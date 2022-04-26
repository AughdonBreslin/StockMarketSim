const userData = require('./users');
const depHistData  = require('./depositHist');
const stockSet = require('./stockSettings.js');
const stockPort = require('./stockPortfolio.js');

// not much to do here
module.exports = {
  users: userData,
  depHist: depHistData,
  stockSettings: stockSet,
  stockPortfolio: stockPort
};