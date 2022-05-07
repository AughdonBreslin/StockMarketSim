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
const createPortfolio = async function createPortfolio(userId, initialDeposit, autoDepFreq, autoDepAmt, minActBal, IFOption) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 6, 6);

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();
    
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

    const stockPortCollection = await stockPortfolios();
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

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;
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

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;
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

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;
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

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;
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

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;
}

const addToTransactionLog = async function addToTransactionLog(id, userId, logEntry) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 3, 3);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    //Checking depHistEntry
    validation.checkId(logEntry, 'Transaction Log ID');
    const tLogEntry = logEntry.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    const update = await stockPortCollection.updateOne(
        {_id: ObjectId(tId)},
        { $addToSet: { transactions: tLogEntry } }
    );

    if (!update.matchedCount && !update.modifiedCount)
       throw 'Adding auto sell id to array failed!';

    const stockPortAdded = this.getSP(tId, tUserId);
    return stockPortAdded;

}

const resetPortfolio = async function resetPortfolio(id, userId) {

    //Check number of args
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking id
    validation.checkId(id, 'Stock Portfolio ID');
    const tId = id.trim();

    //Checking userId
    validation.checkId(userId, 'User Id');
    const tUserId = userId.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({id: ObjectId(tId), user_id: ObjectId(tUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    

}

const checkStockPortExists = async function checkStockPortExists(userId) {
    
    //Checking num of arguments
    validation.checkNumOfArgs(arguments, 1, 1);

    //Checking ID argument
    validation.checkId(userId, 'User ID');
    const newUserId = userId.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;
    const stockPort = await stockPortCollection.findOne({user_id: ObjectId(newUserId)});

    if(!stockPort) {
        return null;
    } else {
        stockPort._id = stockPort._id.toString();
        stockPort.user_id = stockPort.user_id.toString();
        return stockPort;
    }
}

const getSP = async function getSP(id, userId) {

    //Checking num of arguments
    validation.checkNumOfArgs(arguments, 2, 2);

    //Checking ids
    validation.checkId(id, 'Stock Portfolio Id');
    const newId = id.trim();

    validation.checkId(userId, 'User Id');
    const newUserId = userId.trim();

    const stockPortCollection = await stockPortfolios();
    if (!stockPortCollection) throw `Error: Could not find stock settings collection`;

    const stockPort = await stockPortCollection.findOne({_id: ObjectId(newId), user_id: ObjectId(newUserId)});
    if(!stockPort) throw `Error: This user doesn't have a stock portfolio!`;

    stockPort._id = newId;
    stockPort.user_id = newUserId;
    return stockPort;
}

module.exports = {
    createPortfolio,
    updatePVal,
    updateCurrentBal,
    addToDepHist,
    addToAutoPurchases,
    addToAutoSell,
    addToTransactionLog,
    checkStockPortExists,
    getSP
}