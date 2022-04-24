// {
//     "_id": "507f1f77bcf86cd799439011",

//     "stockPortfolio_id": "507f1f77bcf86cd799439011", /* Each deposit must correspond to a stock-portfolio document */

//     "deposit-amount": 400,
//     "manual-or-automated": true, /* false=automated deposite, true=manual */
//     "deposit-date": "<YYYY-mm-dd>" /* store as new Date Object */
// }

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');

/* functions */

/**  get the entire dep history of a user. Returns all deposits associated w/ a stockPortfolio_id */
const getDepositsOfUser = async function(stockPortfolio_id) {
    // error checking
    validation.checkNumOfArgs(arguments,1,1);


    // make connection and get collection

    // MongoDB Query

    // Check if query returned a valid value

    // If returned value = [] (ie: no deposits associated w/ a stockPortfolio_id, then error bc this should not happen) else, return an array of depositHistory_ids


}

/* Get a deposit Element associated with the given deposit_id */
const getDeposit = async function(deposit_id) {
    // error checking
    validation.checkNumOfArgs(arguments,1,1);


    // make connection and get collection

    // mongoDB query

    // check if query returned a valid value. If it did, return the item. else error. 

}


/** add a dep hist elem for a user (fires when $ is deposited into a user's account)
Note: The function adds only a record of a deposit. It does not change the actual account balance. To change the account balance (stockPortfolio.current-balance), a seperate function should be called in the stockPortfolio subdoc. */
const addDepositRecord = async function(stockPortfolio_id, dep_amnt, man_or_aut, dep_date) {
    // error checking
    validation.checkNumOfArgs(arguments,4,4);
    validation.checkInt(dep_amnt, "Deposit Amount");
    // validation. // check function that checks if boolean
    // 

    // Make the depositRecord Object
    const depRecObj = {
        "_id": ObjectId(),
        "stockPortfolio_id": stockPortfolio_id,
        "deposit-amount": dep_amnt,
        "manual-or-automated": man_or_aut,
        "deposit-date": dep_date
    }

    // Make connection and get collection

    // Add the Object to the collection

    // Check the above return value and return the proper return value



}

modules.exports = {
    getDepositsOfUser, getDeposit, addDepositRecord
}

