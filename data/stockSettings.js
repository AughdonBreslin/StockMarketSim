const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');



//Called when a new account has been created.  Takes the user inputted settings and creates an entry within the document
//---Note--- This is only called when an account has been created.  Any other settings changed post-account creation are different functions
const accountCreatedSettings = async function accountCreatedSettings(userId, initialDeposit, autoDepFreq, autoDepAmt, minAccBal, insufficientFunds) {

    //Checks number of arguments
    validation.checkNumOfArgs(arguments,6,6);

    //Should I check if the user is authenticated???


    validation.checkId(userId, "User Id");
    let tUserId = userId.trim();

    const numID = validation.checkMoneyAmt(initialDeposit, "Initial Deposit", false);

    validation.checkInt(autoDepFreq, "Auto Deposit Frequency");
    if (autoDepFreq < 0) throw `Error: Auto Deposit Frequency cannot be a negative number!`;

    const numAutoDA = validation.checkMoneyAmt(autoDepAmt, "Auto Deposit Amount", false);

    const numMinAB = validation.checkMoneyAmt(minAccBal, "Minimum Account Balance", false);

}

module.exports = {
    accountCreatedSettings
}