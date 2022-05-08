const { ObjectId } = require('mongodb')
const mongoCollections = require('../config/mongoCollections')
const portfolioCollection = mongoCollections.portfolios
const validation = require('../validation')
const api = require('./api')
const autoInterval = 15 // possible to set from stockmarketsettings

let awaiting = false

/**TODO
 * - Adjust functions to account for new price per share (for transactions, autoBuys, autoSells)
 * - Adjust functions to account for new database schema (no separate collections for transactions, autoBuys, and autoSells. All are now subdocs of portfolios)
 * - Fix getTransactions function
 * - Create function to get awaitingTrades
 */

// getDate
function getDate() {
    let date = new Date()
    date = date.toLocaleString('en-US', { timeZone: 'America/New_York' })
    return date
}

// duringTradingHours
function duringTradingHours() {
    const date = getDate()
    if (date.getDay() > 0 && date.getDay() < 6) { // weekday
        if ((date.getHours() == 9 && date.getMinutes() >= 30) || (date.getHours() > 9 && date.getHours() < 16)) { // Between 9:30 AM and 4:00 PM
            return true
        }
    }
    return false
}

// timeToOpen
function timeToOpen() {
    let hours = 0
    let minutes = 0
    let seconds = 0
    const date = getDate()

    if (duringTradingHours()) return 0

    if (date.getHours() >= 16) {
        hours = 24 - date.getHours() - 1
        if (!(date.getMinutes() == 0 && date.getSeconds() == 0)) {
            minutes = 60 - date.getMinutes() - 1
            if (date.getSeconds() != 0) {
                seconds = 60 - date.getSeconds()
            } else {
                minutes++
            }
        } else {
            hours++
        }
        hours += 9
        minutes += 30
    } else { // get time to 10 then subtract 30 minutes
        hours = 10 - date.getHours() - 1
        if (!(date.getMinutes() == 0 && date.getSeconds() == 0)) {
            minutes = 60 - date.getMinutes() - 1
            if (date.getSeconds() != 0) {
                seconds = 60 - date.getSeconds()
            } else {
                minutes++
            }
        } else {
            hours++
        }
        if (minutes < 30) {
            hours--
            minutes += 30
        } else {
            minutes -= 30
        }
    }

    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000
}

// getAutoBuySorted
async function getAutoBuysSorted(id) {
    // validate id
    id = validation.checkId(id, "Stock Portfolio ID")

    // find portfolio using id
    let portfolio = await portfolioCollection.findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // check to see if portfolio has any awaitingTrades
    if (!portfolio["awaitingTrades"]) throw "No awaitingTrades found" // may just return an empty object instead of throwing an error
    // check to see if any of the awaitingTrades are autoBuys
    let autoBuys = portfolio["awaitingTrades"].filter(x => x["type"] == "autoBuy")
    if(!autoBuys) throw "No autoBuys found"

    // get all priorities from autoBuys
    let priorities = autoBuys.map(x => x["priority"])

    // create dictionary of priorities and their corresponding autoBuys
    let priorityIndex = {}
    for (let i = 0; i < autoBuys.length; i++) {
        priorityIndex[priorities[i]] = autoBuys[i]
    }

    // sort priorities from lowest to highest
    priorities = priorities.sort((a, b) => a - b)

    // map priorities to autoBuys
    autoBuys = priorities.map(x => priorityIndex[x])

    // adjust priorities to have intervals of 1
    for (let i = 0; i < autoBuys.length; i++) {
        autoBuys[i]["priority"] = (i + 1)
    }

    // update awaitingTrades
    let awaitingTrades = portfolio["awaitingTrades"].filter(x => x["type"] != "autoBuy")
    awaitingTrades = awaitingTrades.concat(autoBuys)

    // update portfolio
    const updateInfo = await portfolioCollection.updateOne({ _id: id }, { $set: {"awaitingTrades": awaitingTrades} })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "Portfolio was not updated"

    return autoBuys
}

// updatePriorities
async function updatePriorities(id, priority) {
    // validate id and priority
    id = validation.checkId(id, "Stock Portfolio ID")
    priority = validation.checkInt(priority, "Priority")

    // call getAutoBuysSorted
    let autoBuys = await getAutoBuysSorted(id)

    // check to see if priority is in range of autoBuys
    if (priority <= autoBuys.length) {
        // increment all priorities in autoBuys after priority
        for (let i = priority; i < autoBuys.length; i++) {
            autoBuys[i]["priority"]++
        }

        // get portfolio using id
        let portfolio = await portfolioCollection.findOne({ _id: id })
        if (!portfolio) throw "Stock Portfolio not found"

        // update awaitingTrades
        let awaitingTrades = portfolio["awaitingTrades"].filter(x => x["type"] != "autoBuy")
        awaitingTrades = awaitingTrades.concat(autoBuys)

        // update portfolio
        const updateInfo = await portfolioCollection.updateOne({ _id: id }, { $set: {"awaitingTrades": awaitingTrades} })
        if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "Portfolio was not updated"
    } else {
        return autoBuys.length+1
    }
    return priority
}

// buy
async function buy(id, ticker, quant, threshold = -1, priority = -1, auto = false, interval = "1min") {
    id = validation.checkId(id, "Stock Portfolio ID")
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    threshold = validation.checkInt(threshold, "Threshold")
    priority = validation.checkInt(priority, "Priority")
    auto = validation.checkIsProper(auto, 'boolean', "Auto Flag")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if (ticker.length > 5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if (interval != "1min" && interval != "5min" && interval != "15min" && interval != "30min" && interval != "60min") throw "Invalid Interval"
    let autoFlag = false
    // let retId = ""

    // determine if during trading hours (9:30am - 4:00pm on weekdays)
    // if auto, don't throw an error, add to awaitingTrades subCollection, set awaiting to true 
    if (!duringTradingHours()) {
        if (auto) {
            autoFlag = true
            // updatePriorities(id, priority)
            // retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), timeToOpen())
            }
        } else {
            throw "Unable to buy outside of trading hours"
        }
    }
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find portfolio using id
    let portfolio = await portfolioCollection.findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // get the stock price from the api
    const price = await api.price(ticker, interval)
    // check if user has enough money to buy quant amount of stock
    // if auto, don't throw an error add to awaitingTrades subCollection, set awaiting to true
    if ((price * quant) > portfolio["balance"]) {
        if (!autoFlag && auto) {
            autoFlag = true
            // updatePriorities(id, priority)
            // retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), (autoInterval * 60 * 1000))
            }
        } else {
            throw "Insufficient Funds"
        }
    }

    // check if the price is lte threshold, otherwise, don't buy
    if (price > threshold && threshold != -1) {
        if (auto && !autoFlag) {
            autoFlag = true
            // updatePriorities(id, priority)
            // retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), (autoInterval * 60 * 1000))
            }
        } else {
            throw "Threshold not met"
        }
    }

    if (!autoFlag) {
        // create a new transaction
        // retId = await Transaction(id, "buy", ticker, quant, price * quant, getDate())
        // update the portfolio
        portfolio["balance"] -= (price * quant)
        const tickers = portfolio["stocks"].map(x => x[0])
        if (tickers.include(ticker)) {
            portfolio["stocks"][tickers.indexOf(ticker)][1] += quant
        } else {
            portfolio["stocks"].push([ticker, quant])
        }
        portfolio["transactions"].push({
            "type": "buy",
            "ticker": ticker,
            "quantity": quant,
            "pps": price,
            "date": getDate()
        })
    } else { // if autoFlag, update awaitingTrades field only
        if (priority < 1) throw "Priority not set properly"
        updatePriorities(id, priority)
        portfolio["awaitingTrades"].push({
            "type": "buy",
            "ticker": ticker,
            "quantity": quant,
            "pps_threshold": threshold,
            "priority": priority
        })
    }

    // update in portfolio database
    const updateInfo = await portfolioCollection.updateOne({ _id: id }, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return { "authenticated": true }
    // return `Bought ${quant} stocks of ${ticker}.`;
    // return retId
}

// sell
async function sell(id, ticker, quant, threshold = -1, auto = false, interval = "1min") {
    id = validation.checkId(id, "Stock Portfolio ID")
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    threshold = validation.checkInt(threshold, "Threshold")
    auto = validation.checkIsProper(auto, 'boolean', "Auto Flag")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if (ticker.length > 5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if (interval != "1min" && interval != "5min" && interval != "15min" && interval != "30min" && interval != "60min") throw "Invalid Interval"
    let autoFlag = false
    // let retId = ""

    // determine if during trading hours (9:30am - 4:00pm on weekdays)
    // if auto, don't throw an error, add to autoBuys collection, set awaiting to true 
    if (!duringTradingHours()) {
        if (auto) {
            autoFlag = true
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), timeToOpen())
            }
            // retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
        } else {
            throw "Unable to buy outside of trading hours"
        }
    }
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find portfolio using id
    let portfolio = await portfolioCollection.findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // determine if holding ticker and enough shares
    const tickers = portfolio["stocks"].map(x => x[0])
    if (!tickers.include(ticker)) throw "Not holding ticker"
    if (portfolio["stocks"][tickers.indexOf(ticker)][1] < quant) throw `Not holding enough of ${ticker}`

    // get the stock price from the api
    const price = await api.price(ticker, interval)

    // if auto, check if price is less than threshold
    if (price < threshold && threshold != -1) {
        if (auto && !autoFlag) {
            autoFlag = true
            // updatePriorities(id, priority)
            // retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), (autoInterval * 60 * 1000))
            }
        } else {
            throw "Threshold not met"
        }
    }

    if (!autoFlag) {
        // create a new transaction
        // retId = await Transaction(id, "sell", ticker, quant, price * quant, getDate())
        // update the portfolio
        portfolio["balance"] += (price * quant)
        portfolio["stocks"][tickers.indexOf(ticker)][1] -= quant
        portfolio["stocks"] = portfolio["stocks"].filter(x => x[1] > 0)
        portfolio["transactions"].push({
            "type": "sell",
            "ticker": ticker,
            "quantity": quant,
            "pps": price,
            "date": getDate()
        })
    } else { // if autoFlag, update awaitingTrades field only
        portfolio["awaitingTrades"].push({
            "type": "sell",
            "ticker": ticker,
            "quantity": quant,
            "pps_threshold": threshold,
            "priority": -1
        })
    }

    // update in portfolio database
    const updateInfo = await portfolioCollection.updateOne({ _id: id }, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return {"authenticated": true}
    // return retId 
}

// autoTrade
void async function autoTrade() {
    // check if during trading hours
    if (!duringTradingHours()) {
        setTimeout(autoTrade(), timeToOpen())
        return
    }

    // get all portfolios that do not have awaitingTrades = [] and project id and awaiting trades only
    const ports = await portfolios.find({ "awaitingTrades": { $ne: [] } }).project({ _id: 1, awaitingTrades: 1 }).toArray()
    // check if there are any awaiting trades
    let leftover = false
    if (ports.length) {
        // go through each portfolio
        const buys = []
        for (let i = 0; i < ports.length; i++) {
            // go through each awaiting trade
            let portfolio = ports[i]
            let awaitingTrades = portfolio["awaitingTrades"]
            for (let j = 0; j < awaitingTrades.length; j++) {
                // check for type
                if (awaitingTrades[j]["type"] == "sell") { // attempt to execute immediately
                    try {
                        await sell(portfolio["_id"], awaitingTrades[j]["ticker"], awaitingTrades[j]["quantity"], threshold = awaitingTrades[j]["pps_threshold"], auto = false)
                    } catch { // unable to sell
                        leftover = true
                        continue
                    }
                    // otherwise, if it was able to sell, remove from awaitingTrades
                    awaitingTrades = awaitingTrades.splice(j, 1)
                } else { // store in buys based on priority
                    let k = 0
                    while (k < buys.length && buys[k]["priority"] < awaitingTrades[j]["priority"]) k++
                    buys.splice(k, 0, [j, awaitingTrades[j]])
                }
            }
            // execute all buys
            for (let j = 0; j < buys.length; j++) {
                let buyTrade = buys[j][1]
                try {
                    await buy(portfolio["_id"], buyTrade["ticker"], buyTrade["quantity"], threshold = buyTrade["pps_threshold"], auto = false)
                } catch { // unable to buy
                    leftover = true
                    continue
                }
                // otherwise, if it was able to buy, remove from awaitingTrades
                awaitingTrades.splice(buys[j][0], 1)
            }
            // update portfolio
            await portfolioCollection.updateOne({ _id: portfolio["_id"] }, { $set: { "awaitingTrades": awaitingTrades } })
        }
    }

    // if there are leftover awaiting trades, set timeout
    if (leftover) {
        setTimeout(autoTrade(), (autoInterval * 60 * 1000))
    } else {
        awaiting = false
    }
}

// req.session.stockPortId

// getTransactions
async function getTransactions(id) {
    // validate ids
    id = validation.checkId(id, "Stock Portfolio ID")

    // get portfolio using id
    let portfolio = await portfolioCollection.findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // get transactions from portfolio
    return portfolio["transactions"]

    /*
    const sample_trans_list = [
        {
            "_id": "507f1f77bcf86cd799439011",

            "portfolio_id": "507f1f77bcf86cd799439011", // Each transaction must correspond to a stock-portfolio document 

            "type": "purchase", // "purchase" or "sell" 
            "ticker": "GOOG",
            "quantity": 1, // min: 1.  max: Number.MAX_SAFE_INTEGER - 1 
            "amount": 900 // positive number ,
            "date": new Date(2021, 11, 09) // store as new Date Object 
        },
        {
            "_id": "507f1f77bcf86cd799439012",

            "portfolio_id": "507f1f77bcf86cd799439011", // Each transaction must correspond to a stock-portfolio document 

            "type": "sell", // "purchase" or "sell" 
            "ticker": "AAPL",
            "quantity": 12, // min: 1.  max: Number.MAX_SAFE_INTEGER - 1 
            "amount": 500 // positive number ,
            "date": new Date(2022, 1, 14) // Month is 0-indexed. ie: 1 = February 
        }
    ];

    return sample_trans_list;
    */
}

module.exports = {
    buy,
    sell,
    getAutoBuysSorted,
    getTransactions
}