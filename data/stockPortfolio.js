const mongoCollections = require('../config/mongoCollections');
const stockPortfolio = mongoCollections.stockPortfolio;
const {ObjectId} = require('mongodb');
const validation = require('../validation');


//Create stock portfolio for a user when a user signs up
const createPortfolio = async function createPortfolio() {

}

//Updates portfolio-value field with the current stock portfolio value
//Adds old PVal to PValHistory array
const updatePVal = async function updatePVal(pVal) {

}

//Updates current-balance field with the current stock 
const updateCurrentBal = async function updateCurrentBal(currBal) {

}

//Adds despoitHistory document id to array in stockPortfolio
const addToDepHist = async function addToDepHist() {

}

//Adds AutomatedPurchase document id to array in stockPortfolio document
const addToAutoPurchases = async function addToAutoPurchases() {

}

//Adds AutomatedSelling document id to array in stockPortfolio document
const addToAutoSell = async function addToAutoSell() {

}

const addToTransactionLog = async function addToTransactionLog() {

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