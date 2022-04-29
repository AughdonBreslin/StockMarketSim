const mongoCollections = require('../config/mongoCollections');
const stockPortfolios = mongoCollections.portfolios;
const users = mongoCollections.users
const {ObjectId} = require('mongodb');
const validation = require('../validation');


//Create stock portfolio for a user when a user signs up
/*

    When a stock portfolio is created or reset, certain things are set.

    A form should be prompted for the user to enter their initial deposit into the system.
    Afterwards, they can choose to change settings and buy/sell stocks on their portfolio

*/
const createPortfolio = async function createPortfolio(userId, initialDeposit) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();
    
    //Checking value
    const tInitialDepo = validation.checkMoneyAmt(initialDeposit, 'Initial Deposit', false);

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({user_id: ObjectId(tUserId)});
    if(stockPort) throw `Error: This user already has a stock portfolio set!`;

    let stockSet = {
        initial_deposit: tInitialDepo,
        automated_deposit_freq: "none",
        automated_deposit_amount: 0,
        minimum_account_balance: 0,
        insufficient_funds_option: false
    }

    let newStockPort = {
        user_id: tUserId,
        value: 0,
        balance: 0,
        stocks: {},
        depositHistory: [],
        autoBuys: [],
        autoSells: [],
        transactions: [],
        dailyValues: [],
        settings: stockSet
    }

    const insertInfo = await stockPortCollection.insertOne(newStockPort);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw `Error: Could not add new stock portfolio.`;    
    
    // Return acknowledgement
    return {stockPortfolioCreated: true};

}

//Updates portfolio-value field with the current stock portfolio value
//Adds old PVal to PValHistory array
const updatePVal = async function updatePVal(id, userId, pVal) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking pVal
    const tPVal = validation.checkMoneyAmt(pVal, "Portfolio Value", false);

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $set: {value: tPVal} }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Updating portfolio value failed';

    return {updated: true}
}

//Updates current-balance field with the current stock 
const updateCurrentBal = async function updateCurrentBal(id, userId, currBal) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking currBal
    const tCurrBal = validation.checkMoneyAmt(currBal, "Current Balance", false);

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $set: {balance: tCurrBal} }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Updating current portfolio balance failed';

    return {updated: true}
}

//Adds despoitHistory document id to array in stockPortfolio
const addToDepHist = async function addToDepHist(id, userId, depHistEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking depHistEntry
    validation.checkId(depHistEntry, 'Deposit History ID');
    const tDepHistEntry = depHistEntry.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $addToSet: { depositHistory: tDepHistEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding deposit history id to array failed!';

    return {updated: true}
}

//Adds AutomatedPurchase document id to array in stockPortfolio document
const addToAutoPurchases = async function addToAutoPurchases(id, userId, autoPurchaseEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking depHistEntry
    validation.checkId(autoPurchaseEntry, 'Auto Purchase ID');
    const tAutoPurchaseEntry = autoPurchaseEntry.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $addToSet: { autoBuys: tAutoPurchaseEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto buy id to array failed!';

    return {updated: true}
}

//Adds AutomatedSelling document id to array in stockPortfolio document
const addToAutoSell = async function addToAutoSell(id, userId, autoSellEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking depHistEntry
    validation.checkId(autoSellEntry, 'Auto Sell ID');
    const tAutoSellEntry = autoSellEntry.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $addToSet: { autoSells: tAutoSellEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto sell id to array failed!';

    return {updated: true}
}

const addToTransactionLog = async function addToTransactionLog() {

}

const resetPortfolio = async function resetPortfolio() {
    
}

module.exports = {
    createPortfolio,
    updatePVal,
    updateCurrentBal,
    addToDepHist,
    addToAutoPurchases,
    addToAutoSell,
    addToTransactionLog
}