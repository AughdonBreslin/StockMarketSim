// Document format example:

// {
//     "_id": "507f1f77bcf86cd799439011",

//     "stockPortfolio_id": "507f1f77bcf86cd799439011", /* Each deposit must correspond to a stock-portfolio document */

//     "deposit-amount": 400,
//     "manual-or-automated": true, /* false=automated deposite, true=manual */
//     "deposit-date": "<YYYY-mm-dd>" /* store as new Date Object */
// }

const mongoCollections = require('../config/mongoCollections');
const deposits = mongoCollections.deposits;
const {ObjectId} = require('mongodb');
const validation = require('../validation');

/* functions */

/**  get the entire dep history of a user. Returns all deposits associated w/ a stockPortfolio_id */
const getDepositsOfUser = async function(stockPortfolio_id) {
    // error checking
    validation.checkNumOfArgs(arguments,1,1);

    // Check if stockPortfolio_id is valid input
    if (!ObjectId.isValid(stockPortfolio_id)) throw `Error: Invalid stock portfolio ID provided.`;

    // get collection
    const depositsCollection = await deposits();
    if(!depositsCollection) throw `Error: Could not find depositsCollection.`;

    // MongoDB Query -- get all depositHist Id's associated w/ the stockPortfolio_id
    const stkport_deps = await depositsCollection.find({stockPortfolio_id: stockPortfolio_id}, {_id: 1});
    
    // Check if query returned a valid value    
    // If query returns [] (ie: no deposits associated w/ a stockPortfolio_id, then error bc this should not happen) else, return an array of depositHistory_ids

    if(stkport_deps.toArray().length === 0) throw `Error: The stock portfolio has no deposits associated with it. This should NOT happen!`;

    return stkport_deps.toArray();

}

/* Get a deposit Element associated with the given deposit_id */
const getDeposit = async function(deposit_id) {
    // error checking
    validation.checkNumOfArgs(arguments,1,1);

    // Check if deposit_id is valid input
    if (!ObjectId.isValid(deposit_id)) throw `Error: Invalid deposit ID provided.`;

    // get collection
    const depositsCollection = await deposits();
    if(!depositsCollection) throw `Error: Could not find depositsCollection.`;

    // MongoDB Query -- get deposit info associated with the given id
    const deposit = await depositsCollection.findOne({_id: deposit_id});

    // check if query returned a valid value. If it did, return the item. else error. 
    if (Object.keys(deposit).length === 0) throw `Error: A deposit with the given ID was NOT found. This should NOT happen!`;
    
    return deposit;

}


/** add a dep hist elem for a user (fires when $ is deposited into a user's account)
Note: The function adds only a record of a deposit. It does not change the actual account balance. To change the account balance (stockPortfolio.current-balance), a seperate function should be called in the stockPortfolio subdoc. Return the added deposit record. */
const addDepositRecord = async function(stockPortfolio_id, dep_amnt, man_or_aut) {
    // error checking
    validation.checkNumOfArgs(arguments,3,3);
    if (!ObjectId.isValid(stockPortfolio_id)) throw `Error: Invalid stock portfolio ID provided.`;
    validation.checkInt(dep_amnt, "Deposit Amount");
    validation.checkBoolean(man_or_aut, "Manual or Automated");

    // Make the depositRecord Object
    const depRecObj = {
        // "_id": ObjectId(),
        "stockPortfolio_id": stockPortfolio_id,
        "deposit-amount": dep_amnt,
        "manual-or-automated": man_or_aut,
        "deposit-date": new Date()
    };

    // get collection
    const depositsCollection = await deposits();
    if(!depositsCollection) throw `Error: Could not find depositsCollection.`;

    // MongoDB Query -- get deposit info associated with the given id
    const newDeposit = await depositsCollection.insertOne(depRecObj);

    // check if query returned the newly created value. If it did, return the item. else error. 
    if (Object.keys(newDeposit).length === 0) throw `Error: A${man_or_aut ? " manual" : "n automated" } $${dep_amnt} deposit could not be created for stock portfolio ${stockPortfolio_id}. This should NOT happen!`;
    
    return newDeposit;

}

module.exports = {
    getDepositsOfUser,
    getDeposit,
    addDepositRecord
}

