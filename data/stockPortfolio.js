const mongoCollections = require('../config/mongoCollections');
const portfolios = mongoCollections.portfolios;
const users = mongoCollections.users
const {ObjectId} = require('mongodb');
const validation = require('../validation');


//Create stock portfolio for a user when a user signs up
/*

    When a stock portfolio is created or reset, certain things are set.

    A form should be prompted for the user to enter their initial deposit into the system.
    Afterwards, they can choose to change settings and buy/sell stocks on their portfolio

*/
const createPortfolio = async function createPortfolio(userID, initialDeposit, autoDepFreq, autoDepAmt, minActBal, IFOption) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 6, 6);

    //Checking userID
    validation.checkId(userID, 'User Id');
    const tUserId = userID.trim();
    
    //Checking value
    const tInitialDepo = validation.checkMoneyAmt(initialDeposit, 'Initial Deposit', false);
    const tAutoDepFreq = validation.checkAutoDepFreq(autoDepFreq);
    const tAutoDepAmt = validation.checkMoneyAmt(autoDepAmt, 'Automatic Deposit Amount', false);
    const tMinActBal = validation.checkMoneyAmt(minActBal, 'Minimum Account Balance', false);
    let tIFOption;
    if (typeof IFOption === 'string') {
        tIFOption = validation.checkInsufficientFundOption(IFOption);
    } else if (typeof IFOption === 'boolean') {
        tIFOption = IFOption;
    } else throw `Error: Insufficient Fund Option not of type string or boolean!`;

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({user_id: ObjectId(tUserId)});
    if (stockPort) throw `Error: This user already has a stock portfolio set!`;

    let stockSet = {
        initial_deposit: tInitialDepo,
        automated_deposit_freq: tAutoDepFreq,
        automated_deposit_amount: tAutoDepAmt,
        minimum_account_balance: tMinActBal,
        insufficient_funds_option: tIFOption
    }

    let newStockPort = {
        user_id: ObjectId(tUserId),
        value: 0,
        balance: tInitialDepo,
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
    let stockPortId = insertInfo.insertedId;
    const stockPortAdded = this.getSP(stockPortId.toString().trim(), tUserId);

    return stockPortAdded;

}

//Updates portfolio-value field with the current stock portfolio value
//Adds old PVal to PValHistory array
const updatePVal = async function updatePVal(portID, userID, pVal) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking portID
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    //Checking pVal
    pVal = validation.checkMoneyAmt(pVal, "Portfolio Value", false);

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $set: {value: pVal} }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Updating portfolio value failed';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;
}

//Updates current-balance field with the current stock 
const updateCurrentBal = async function updateCurrentBal(portID, userID, currBal) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking portID
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    //Checking currBal
    currBal = validation.checkMoneyAmt(currBal, "Current Balance", false);

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $set: {balance: currBal} }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Updating current portfolio balance failed';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;
}

//Adds despoitHistory document id to array in stockPortfolio
const addToDepHist = async function addToDepHist(portID, userID, depHistEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking portID
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    //Checking depHistEntry
    validation.checkId(depHistEntry, 'Deposit History ID');
    depHistEntry = depHistEntry.trim();

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $addToSet: { depositHistory: depHistEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding deposit history id to array failed!';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;
}

//Adds AutomatedPurchase document id to array in stockPortfolio document
const addToAutoPurchases = async function addToAutoPurchases(portID, userID, autoPurchaseEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userId = userID.trim();

    //Checking depHistEntry
    validation.checkId(autoPurchaseEntry, 'Auto Purchase ID');
    autoPurchaseEntry = autoPurchaseEntry.trim();

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $addToSet: { autoBuys: autoPurchaseEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto buy id to array failed!';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;
}

//Adds AutomatedSelling document id to array in stockPortfolio document
const addToAutoSell = async function addToAutoSell(portID, userID, autoSellEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userId = userID.trim();

    //Checking depHistEntry
    validation.checkId(autoSellEntry, 'Auto Sell ID');
    autoSellEntry = autoSellEntry.trim();

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $addToSet: { autoSells: autoSellEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto sell id to array failed!';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;
}

const addToTransactionLog = async function addToTransactionLog(portID, userID, logEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(portID, 'Stock Portfolio ID');
    portID = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    //Checking depHistEntry
    validation.checkId(logEntry, 'Transaction Log ID');
    logEntry = logEntry.trim();

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(portID)},
        { $addToSet: { transactions: logEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto sell id to array failed!';

    const stockPortAdded = this.getSP(portID, userID);
    return stockPortAdded;

}

const removePortfolio = async function removePortfolio(portID, userID) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking id
    validation.checkId(portID, 'Stock Portfolio ID');
    portId = portID.trim();

    //Checking userID
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    const portCollection = await portfolios();
    if (!portCollection) throw `Error: Could not find port collection`;

    const stockPort = await portCollection.findOneAndDelete({id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort.value) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    return `${stockPort.value.name} has been successfully deleted!`;
}

const checkStockPortExists = async function checkStockPortExists(userID) {
    
    //Checking num of arguments
    validation.checkNumOfArgs(arguments, 1, 1);

    //Checking ID argument
    validation.checkId(userID, 'User ID');
    userID = userID.trim();

    const portCollection = await portfolios();
    if (!portCollection) throw `Error: Could not find stock portfolio collection.`;
    const port = await portCollection.findOne({user_id: ObjectId(userID)});

    if(!port) throw `Error: Could not find portfolio with userID ${userID}`;

    port._id = port._id.toString();
    port.user_id = port.user_id.toString();
    return port;
}

const getSP = async function getSP(portID, userID) {

    //Checking num of arguments
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking ids
    validation.checkIsProper(portID, 'string', 'Stock Portfolio ID');
    validation.checkId(portID, 'Stock Portfolio Id');
    portID = portID.trim();
    
    validation.checkIsProper(userID, 'string', 'User ID');
    validation.checkId(userID, 'User Id');
    userID = userID.trim();

    const stockPortCollection = await portfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({_id: ObjectId(portID), user_id: ObjectId(userID)});
    if(!stockPort) throw `Error: User ${userID} does not have a stock portfolio under portID ${portID}!`;

    stockPort._id = portID;
    stockPort.user_id = userID;
    return stockPort;
}

const changePortSettings = async function changeMutableSettings(portID, minAccBal, IFOption) {
    validation.checkNumOfArgs(arguments, 2, 3);

    //Checking id field
    validation.checkId(portID, "Port ID");
    portID = portID.trim();

    IFOption = validation.checkInsufficientFundOption(IFOption);

    if (minAccBal) {
        validation.checkIsProper(minAccBal, 'number', 'Min Account Balance');
        validation.checkWithinBounds(minAccBal, 0, Number.MAX_SAFE_INTEGER);
    }

    // Get collection & change DB data
    const portCollection = await portfolios();
    if (!portCollection) throw `Error: Could not find portfolio collection`;

    const portfolio = await portfolioCollection.findOne({ _id: ObjectId(portID) });
    if(!portfolio) throw `Error: Portfolio not found with ID ${portID}.`;

    let settings = portfolio.settings;
    if (!settings) throw `Error: No settings?`

    if (minAccBal) {
        settings.minimum_account_balance = minAccBal;
    }
    settings.insufficient_funds_option = IFOption;

    const newPortfolio = await portfolioCollection.findOneAndUpdate({_id: ObjectId(portID)}, {$set: {settings: settings}});
    return newPortfolio;
}

// const changeMinAccountBalance = async function changeMinAccountBalance(portID, minAccBal) {
    

    

    
//     ;
// }

// const changeInsufficientFundsOption = async function changeInsufficientFundsOption(portID, IFOption) {
//     validation.checkNumOfArgs(arguments, 2, 2);

//     //Checking id field
//     validation.checkId(portID, "PortID");
//     portID = portID.trim();

    
    
//     // Get collection & change DB data
//     const portCollection = await portfolios();
//     if (!portCollection) throw `Error: Could not find portfolio collection`;

//     const portfolio = await portfolioCollection.findOne({ _id: ObjectId(portID) });
//     if(!portfolio) throw `Error: Portfolio not found with ID ${portID}.`;

//     let settings = portfolio.settings;
//     if (!settings) throw `Error: No settings?`

//     settings.insufficient_funds_option = IFOption;
//     const newPortfolio = await portfolioCollection.findOneAndUpdate({_id: ObjectId(portID)}, {$set: {settings: settings}});
//     return newPortfolio;
// }

module.exports = {
    createPortfolio,
    updatePVal,
    updateCurrentBal,
    addToDepHist,
    addToAutoPurchases,
    addToAutoSell,
    addToTransactionLog,
    checkStockPortExists,
    getSP,
    changePortSettings,
    // changeMinAccountBalance,
    // changeInsufficientFundsOption,
    removePortfolio
}