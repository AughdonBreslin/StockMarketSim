const mongoCollections = require('../config/mongoCollections');
const stockSettings = mongoCollections.stockSettings;
const {ObjectId} = require('mongodb');
const validation = require('../validation');


//Called when a new account has been created.  Takes the user inputted settings and creates an entry within the document
//---Note--- This is only called when an account has been created.  Any other settings changed post-account creation are different functions
const accountCreatedSettings = async function accountCreatedSettings(userId, initialDeposit, autoDepFreq, autoDepAmt, minAccBal, insufficientFunds) {

    //Checks number of arguments
    validation.checkNumOfArgs(arguments,6,6);

    //Should I check if the user is authenticated???

    //Checking userId field
    validation.checkId(userId, "User Id");
    let tUserId = userId.trim();

    //Checking initial deposit
    const numID = validation.checkMoneyAmt(initialDeposit, "Initial Deposit", false);

    //Checking Auto Deposit Frequency (cannot be negative)
    validation.checkIsProper(autoDepFreq, 'string', 'Auto Deposit Frequency');
    let tAutoDepFreq = tAutoDepFreq.trim().toLowerCase();

    if (tAutoDepFreq !== 'none' && tAutoDepFreq !== 'daily' && tAutoDepFreq !== 'weekly' && tAutoDepFreq !== 'monthly') {
        throw `Error: Auto Deposit Frequency cannot be a negative number!`;
    }

    //Checking Auto Deposit Amount
    const numAutoDA = validation.checkMoneyAmt(autoDepAmt, "Auto Deposit Amount", false);

    //Checking Minimum Account Balance (valid money amount)
    const numMinAB = validation.checkMoneyAmt(minAccBal, "Minimum Account Balance", false);

    //Checking Insufficient Fund Option -> change this to boolean
    validation.checkInt(insufficientFunds, "Insufficient Fund Option");

    if (insufficientFunds !== 0 && insufficientFunds !== 1) throw `Error: Invalid option for insufficient fund option!`;

    const stockSetCollection = await stockSettings();
    if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

    const stockSet = await stockSetCollection.findOne({user_id: ObjectId(tUserId)});
    if(stockSet) throw `Error: This user already has initial settings set!`;

    let newSettings = {
        user_id: ObjectId(tUserId),
        initial_deposit: numID,
        automated_deposit_freq: tAutoDepFreq,
        automated_deposit_amount: numAutoDA,
        minimum_account_balance: numMinAB,
        insufficient_funds_option: insufficientFunds
    }

    const insertInfo = await stockSetCollection.insertOne(newSettings);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw `Error: Could not add new stock settings.`;    
    
    // Return acknowledgement
    return {stockSettingsInserted: true};
}

//If the user wants to reset the simulation, they can reset all of their stock settings besides userId
const resetStockSettings = async function resetStockSettings(userId, initialDeposit, autoDepFreq, autoDepAmt, minAccBal, insufficientFunds) {

    //Check the arguments
    validation.checkNumOfArgs(arguments,6,6);

    //Check the userId
    validation.checkId(userId, "User Id");
    let tUserId = userId.trim();

    //Checking initial deposit
    const numID = validation.checkMoneyAmt(initialDeposit, "Initial Deposit", false);

    //Checking Auto Deposit Frequency (cannot be negative)
    validation.checkIsProper(autoDepFreq, 'string', 'Auto Deposit Frequency');
    let tAutoDepFreq = tAutoDepFreq.trim().toLowerCase();

    if (tAutoDepFreq !== 'none' && tAutoDepFreq !== 'daily' && tAutoDepFreq !== 'weekly' && tAutoDepFreq !== 'monthly') {
        throw `Error: Auto Deposit Frequency cannot be a negative number!`;
    }

    //Checking Auto Deposit Amount
    const numAutoDA = validation.checkMoneyAmt(autoDepAmt, "Auto Deposit Amount", false);

    //Checking Minimum Account Balance (valid money amount)
    const numMinAB = validation.checkMoneyAmt(minAccBal, "Minimum Account Balance", false);

    //Checking Insufficient Fund Option -> change this to boolean
    validation.checkInt(insufficientFunds, "Insufficient Fund Option");

    if (insufficientFunds !== 0 && insufficientFunds !== 1) throw `Error: Invalid option for insufficient fund option!`;

    //Get the stockSettings collection.  If it doesn't exist, return an error
    const stockSetCollection = await stockSettings();
    if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

    //Get the user according to the userId.  If they don't exist, return an error.
    const stockSet = await stockSetCollection.findOne({user_id: ObjectId(tUserId)});
    if (!stockSet) throw `Error: There are no current settings set for this user!`;

    const resetSettings = {
        user_id: ObjectId(tUserId),
        initial_deposit: numID,
        automated_deposit_freq: tAutoDepFreq,
        automated_deposit_amount: numAutoDA,
        minimum_account_balance: numMinAB,
        insufficient_funds_option: insufficientFunds
    }

    const newId = stockSet._id;

    const updatedInfo = await stockSetCollection.updateOne(
        { _id: ObjectId(newId) },
        { $set: resetSettings }
     );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update stock settings successfully';
    }

    return {reset: true};

}

//--------------- Functions called when the user wants to update settings while current simulation is runnning -----------------------

const changeAutoDepositFrequency = async function changeAutoDepositFrequency(id, userId, autoDepFreq) {

}

const changeAutoDepositAmount = async function changeAutoDepositAmount(id, userId, autoDepAmt) {

}

const changeMinAccountBalance = async function changeMinAccountBalance(id, userId, minAccBal) {

}

const changeInsufficientFundOption = async function changeInsufficientFundOption(id, userId, IFOption) {

}

module.exports = {
    accountCreatedSettings,
    resetStockSettings,
    changeAutoDepositFrequency,
    changeAutoDepositAmount,
    changeMinAccountBalance,
    changeInsufficientFundOption
}