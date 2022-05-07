const mongoCollections = require('../config/mongoCollections');
const stockSettings = mongoCollections.stockSettings;
const { ObjectId } = require('mongodb');
const validation = require('../validation');


//Called when a new account has been created.  Takes the user inputted settings and creates an entry within the document
//---Note--- This is only called when an account has been created.  Any other settings changed post-account creation are different functions
// const accountCreatedSettings = async function accountCreatedSettings(userId, initialDeposit, autoDepFreq, autoDepAmt, minAccBal, insufficientFunds) {

//     //Checks number of arguments
//     validation.checkNumOfArgs(arguments, 6, 6);

//     //Should I check if the user is authenticated???

//     //Checking userId field
//     validation.checkId(userId, "User Id");
//     let tUserId = userId.trim();

//     //Checking initial deposit
//     const numID = validation.checkMoneyAmt(initialDeposit, "Initial Deposit", false);

//     //Checking Auto Deposit Frequency (cannot be negative)
//     validation.checkIsProper(autoDepFreq, 'string', 'Auto Deposit Frequency');
//     let tAutoDepFreq = tAutoDepFreq.trim().toLowerCase();

//     if (tAutoDepFreq !== 'none' && tAutoDepFreq !== 'daily' && tAutoDepFreq !== 'weekly' && tAutoDepFreq !== 'monthly') {
//         throw `Error: Auto Deposit Frequency cannot be a negative number!`;
//     }

//     //Checking Auto Deposit Amount
//     const numAutoDA = validation.checkMoneyAmt(autoDepAmt, "Auto Deposit Amount", false);

//     //Checking Minimum Account Balance (valid money amount)
//     const numMinAB = validation.checkMoneyAmt(minAccBal, "Minimum Account Balance", false);

//     //Checking Insufficient Fund Option -> change this to boolean
//     validation.checkInt(insufficientFunds, "Insufficient Fund Option");

//     if (insufficientFunds !== 0 && insufficientFunds !== 1) throw `Error: Invalid option for insufficient fund option!`;

//     const stockSetCollection = await stockSettings();
//     if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

//     const stockSet = await stockSetCollection.findOne({ user_id: ObjectId(tUserId) });
//     if (stockSet) throw `Error: This user already has initial settings set!`;

//     let newSettings = {
//         user_id: ObjectId(tUserId),
//         initial_deposit: numID,
//         automated_deposit_freq: tAutoDepFreq,
//         automated_deposit_amount: numAutoDA,
//         minimum_account_balance: numMinAB,
//         insufficient_funds_option: insufficientFunds
//     }

//     const insertInfo = await stockSetCollection.insertOne(newSettings);
//     if (!insertInfo.acknowledged || !insertInfo.insertedId) throw `Error: Could not add new stock settings.`;

//     // Return acknowledgement
//     return { stockSettingsInserted: true };
// }

// //If the user wants to reset the simulation, they can reset all of their stock settings besides userId
// const resetStockSettings = async function resetStockSettings(userId, initialDeposit, autoDepFreq, autoDepAmt, minAccBal, insufficientFunds) {

//     //Check the arguments
//     validation.checkNumOfArgs(arguments, 6, 6);

//     //Check the userId
//     validation.checkId(userId, "User Id");
//     let tUserId = userId.trim();

//     //Checking initial deposit
//     const numID = validation.checkMoneyAmt(initialDeposit, "Initial Deposit", false);

//     //Checking Auto Deposit Frequency (cannot be negative)
//     validation.checkIsProper(autoDepFreq, 'string', 'Auto Deposit Frequency');
//     let tAutoDepFreq = tAutoDepFreq.trim().toLowerCase();

//     if (tAutoDepFreq !== 'none' && tAutoDepFreq !== 'daily' && tAutoDepFreq !== 'weekly' && tAutoDepFreq !== 'monthly') {
//         throw `Error: Auto Deposit Frequency cannot be a negative number!`;
//     }

//     //Checking Auto Deposit Amount
//     const numAutoDA = validation.checkMoneyAmt(autoDepAmt, "Auto Deposit Amount", false);

//     //Checking Minimum Account Balance (valid money amount)
//     const numMinAB = validation.checkMoneyAmt(minAccBal, "Minimum Account Balance", false);

//     //Checking Insufficient Fund Option -> change this to boolean
//     validation.checkInt(insufficientFunds, "Insufficient Fund Option");

//     if (insufficientFunds !== 0 && insufficientFunds !== 1) throw `Error: Invalid option for insufficient fund option!`;

//     //Get the stockSettings collection.  If it doesn't exist, return an error
//     const stockSetCollection = await stockSettings();
//     if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

//     //Get the user according to the userId.  If they don't exist, return an error.
//     const stockSet = await stockSetCollection.findOne({ user_id: ObjectId(tUserId) });
//     if (!stockSet) throw `Error: There are no current settings set for this user!`;

//     const resetSettings = {
//         user_id: ObjectId(tUserId),
//         initial_deposit: numID,
//         automated_deposit_freq: tAutoDepFreq,
//         automated_deposit_amount: numAutoDA,
//         minimum_account_balance: numMinAB,
//         insufficient_funds_option: insufficientFunds
//     }

//     const newId = stockSet._id;

//     const updatedInfo = await stockSetCollection.updateOne(
//         { _id: ObjectId(newId) },
//         { $set: resetSettings }
//     );

//     if (updatedInfo.modifiedCount === 0) {
//         throw 'could not update stock settings successfully';
//     }

//     return { reset: true };

// }

//--------------- Functions called when the user wants to update settings while current simulation is runnning -----------------------

// const changeAutoDepositFrequency = async function changeAutoDepositFrequency(id, autoDepFreq) {
//     //Checks number of arguments
//     validation.checkNumOfArgs(arguments, 2, 2);

//     //Checking userId field
//     // validation.checkId(userId, "User Id");
//     // userId = userId.trim();

//     //Checking id field
//     validation.checkId(id, "Settings id");
//     id = id.trim();

//     autoDepFreq = validation.checkAutoDepFreq(autoDepFreq);

//     // Get collection & change DB data
//     const stockSetCollection = await stockSettings();
//     if (!stockSetCollection) throw `Error: Could not find stock settings collection`;


//     const updatedSettings = {
//         "automated-deposit-freq": autoDepFreq
//     };

//     //Get the settings subdoc according to its id and update it.  If they don't exist, return an error.
//     const stockSetUpdate = await stockSetCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedSettings });
//     if (!stockSetUpdate) throw `Error: There are no current settings set for this user!`;

//     if (stockSetUpdate.modifiedCount === 0) {
//         throw 'could not update settings successfully';
//     }

//     return { changedAutoDepositFrequency: true };

// }

// const changeAutoDepositAmount = async function changeAutoDepositAmount(id, autoDepAmt) {
//     validation.checkNumOfArgs(arguments, 2, 2);

//     //Checking id field
//     validation.checkId(id, "Settings id");
//     id = id.trim();

//     validation.checkInt(autoDepAmt, "Automatic Deposit Amount");
//     validation.checkWithinBounds(autoDepAmt, 1, 100000);

//     // Get collection & change DB data
//     const stockSetCollection = await stockSettings();
//     if (!stockSetCollection) throw `Error: Could not find stock settings collection`;


//     const updatedSettings = {
//         "automated-deposit-amount": autoDepAmt
//     };

//     //Get the settings subdoc according to its id and update it.  If they don't exist, return an error.
//     const stockSetUpdate = await stockSetCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedSettings });
//     if (!stockSetUpdate) throw `Error: There are no current settings set for this user!`;

//     if (stockSetUpdate.modifiedCount === 0) {
//         throw 'could not update settings successfully';
//     }

//     return { changedAutoDepositAmount: true };
// }

const changeMinAccountBalance = async function changeMinAccountBalance(id, minAccBal) {
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking id field
    validation.checkId(id, "Settings id");
    id = id.trim();

    validation.checkInt(minAccBal, "Min Account Balance");
    validation.checkWithinBounds(minAccBal, 1, Number.MAX_SAFE_INTEGER);

    // Get collection & change DB data
    const stockSetCollection = await stockSettings();
    if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

    const updatedSettings = {
        "minimum-account-balance": minAccBal
    };

    //Get the settings subdoc according to its id and update it.  If they don't exist, return an error.
    const stockSetUpdate = await stockSetCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedSettings });
    if (!stockSetUpdate) throw `Error: There are no current settings set for this user!`;

    if (stockSetUpdate.modifiedCount === 0) {
        throw 'could not update settings successfully';
    }

    return { changedMinAccountBalance: true };

}

const changeInsufficientFundOption = async function changeInsufficientFundOption(id, IFOption) {
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking id field
    validation.checkId(id, "Settings id");
    id = id.trim();

    validation.checkBoolean(IFOption, "Insufficient funds option");

    // Get collection & change DB data
    const stockSetCollection = await stockSettings();
    if (!stockSetCollection) throw `Error: Could not find stock settings collection`;

    const updatedSettings = {
        "insufficient-funds-option": IFOption
    };

    //Get the settings subdoc according to its id and update it.  If they don't exist, return an error.
    const stockSetUpdate = await stockSetCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedSettings });
    if (!stockSetUpdate) throw `Error: There are no current settings set for this user!`;

    if (stockSetUpdate.modifiedCount === 0) {
        throw 'could not update settings successfully';
    }
    return { changedInsufficientFundOption: true };

}

module.exports = {
    // accountCreatedSettings,
    // resetStockSettings,
    // changeAutoDepositFrequency,
    // changeAutoDepositAmount,
    changeMinAccountBalance,
    changeInsufficientFundOption
}