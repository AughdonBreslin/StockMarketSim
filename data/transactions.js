const mongoCollections = require('../config/mongoCollections')
const portfolios = mongoCollections.portfolios
const autoBuys = mongoCollections.autoBuys
const autoSells = mongoCollections.autoSells
const transactions = mongoCollections.transactions
const validation = require('../validation')
const api = require('./api')
const autoInterval = 15 // possible to set from stockmarketsettings

let awaiting = false

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

// Transaction
async function Transaction(id, type, ticker, quant, amount, date) {
    // validate all inputs

    const transaction = {
        "portfolio_id": id,
        "type": type,
        "ticker": ticker,
        "quantity": quant,
        "amount": amount,
        "date": date
    }
    const insertInfo = await transactions().insertOne(transaction)
    if (!insertInfo["acknowledged"] || !insertInfo["insertedId"]) throw "transaction was not inserted"
    id = insertInfo["insertedId"].toString()
    return id
}

// AwaitingTrade
async function AwaitingTrade(id, type, ticker, quant, threshold, priority = -1) {
    //validate all inputs
    id = validation.checkId(id, "Stock Portfolio ID")
    type = validation.checkString(type, 1, "Type", true, false)
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    threshold = validation.checkInt(threshold, "Threshold")
    priority = validation.checkInt(priority, "Priority")

    const awaitingTrade = {
        "portfolio_id": id,
        "ticker": ticker,
        "quantity": quant,
        "threshold": threshold
    }
    let insertInfo = ""
    if (type == "buy") {
        awaitingTrade["priority"] = priority
        insertInfo = await autoBuys().insertOne(awaitingTrade)
    } else if (type == "sell") {
        insertInfo = await autoSells().insertOne(awaitingTrade)
    } else {
        throw "Invalid trade type"
    }
    if (!insertInfo["acknowledged"] || !insertInfo["insertedId"]) throw "awaiting trade was not inserted"
    id = insertInfo["insertedId"].toString()
    return id
}

// priorities
async function priorities(id) {
    // validate id
    id = validation.checkId(id, "Stock Portfolio ID")

    // find portfolio using id
    let portfolio = await portfolios().findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // check to see if portfolio has any autoBuys
    if (!portfolio["autoBuys"]) throw "No autoBuys found" // may just return an empty object instead of throwing an error

    // get all autoBuys from the ids in autoBuys
    let allAutoBuys = {}
    for (let i = 0; i < portfolio["autoBuys"].length; i++) {
        let autoBuy = await autoBuys().findOne({ _id: portfolio["autoBuys"][i] })
        if (!autoBuy) throw "No autoBuy found"
        allAutoBuys[autoBuy["_id"]] = autoBuy["priority"]
    }

    return allAutoBuys
}

// dupes
function dupes(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) return [i, j]
        }
    }
    return false
}

// updatePriorities
// NOTE: Assumes, no more than TWO duplicates
async function updatePriorities(id, priority) {
    // validate id and priority
    id = validation.checkId(id, "Stock Portfolio ID")
    priority = validation.checkInt(priority, "Priority")

    // find portfolio using id
    let portfolio = await portfolios().findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // check to see if portfolio has any autoBuys
    if (!portfolio["autoBuys"]) throw "No autoBuys found" // may just return an empty object instead of throwing an error

    // get all priorities from autoBuys
    let priorities = []
    for (let i = 0; i < portfolio["autoBuys"].length; i++) {
        let autoBuy = await autoBuys().findOne({ _id: portfolio["autoBuys"][i] })
        if (!autoBuy) throw "No autoBuy found"
        priorities.push(autoBuy["priority"])
    }
    // let priorities = portfolio["autoBuys"].map(x => x["priority"])

    // if there are duplicate priorities, increment the duplicate and run until no duplicates
    let higher = [] // priorities higher than priority
    let indices = [] // corresponds to indices in priorities
    let incremented = [] // 0 if not incremented, 1 if incremented
    for (let i = 0; i < priorities.length; i++) {
        if (priorities[i] >= priority) {
            higher.push(higher)
            indices.push(i)
            incremented.push(0)
        }
    }
    while (higher.includes(priority)) {
        higher[higher.indexOf(priority)]++
        incremented[higher.indexOf(priority)]++
    }
    let dupeIndices = dupes(higher)
    while (dupeIndices) {
        // update the priority of the older duplicate
        if (incremented[dupeIndices[0]] < incremented[dupeIndices[1]]) {
            higher[dupeIndices[0]]++
            incremented[dupeIndices[0]]++
        } else { //if(incremented[dupeIndices[1]]<incremented[dupeIndices[0]]) {
            higher[dupeIndices[1]]++
            incremented[dupeIndices[1]]++
        }
        dupeIndices = dupes(higher)
    }

    // update autoBuys with new priorities
    for (let i = 0; i < indices.length; i++) {
        let autoBuy = await autoBuys().findOne({ _id: portfolio["autoBuys"][indices[i]] })
        if (!autoBuy) throw "No autoBuy found"
        autoBuy["priority"] = higher[i]
        const updateInfo = await autoBuys().updateOne({ _id: autoBuy["_id"] }, autoBuy)
        if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "autoBuy was not updated"
    }

    return priority
}

// buy
async function buy(id, ticker, quant, threshold = 0, priority = 0, auto = false, interval = "1min") {
    id = validation.checkId(id, "Stock Portfolio ID")
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    threshold = validation.checkInt(threshold, "Threshold")
    priority = validation.checkInt(priority, "Priority")
    auto = validation.checkBoolean(auto, "Auto Flag")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if (ticker.length > 5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if (interval != "1min" && interval != "5min" && interval != "15min" && interval != "30min" && interval != "60min") throw "Invalid Interval"
    let autoFlag = false
    let retId = ""

    // determine if during trading hours (9:30am - 4:00pm on weekdays)
    // if auto, don't throw an error, add to autoBuys collection, set awaiting to true 
    if (!duringTradingHours()) {
        if (auto) {
            autoFlag = true
            updatePriorities(id, priority)
            retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), timeToOpen())
            }
        } else {
            throw "Unable to buy outside of trading hours"
        }
    }
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // get the stock price from the api
    const price = await api.price(ticker, interval)
    // if auto, don't throw an error add to autoBuys collection, set awaiting to true
    if ((price * quant) > portfolio["current-balance"]) {
        if (!autoFlag && auto) {
            autoFlag = true
            updatePriorities(id, priority)
            retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), timeToOpen())
            }
        } else {
            throw "Insufficient Funds"
        }
    }

    if (!autoFlag) {
        // create a new transaction
        retId = await Transaction(id, "buy", ticker, quant, price * quant, getDate())
        // update the portfolio
        portfolio["balance"] -= (price * quant)
        if (!portfolio["stocks"][ticker]) {
            portfolio["stocks"][ticker] = quant
        } else {
            portfolio["stocks"][ticker] += quant
        }
        /*
        const tickers = portfolio["stocks"].map(stock => Object.keys(stock)[0])
        if(tickers.includes(ticker)) {
            portfolio["stocks"][tickers.indexOf(ticker)][ticker]+=quant
        } else {
            portfolio["stocks"].push({ticker:quant})
        }
        */
        portfolio["transactions"].push(retId)
    } else { // if autoFlag, update autoBuys field only
        portfolio["autoBuys"].push(retId)
    }

    // update in portfolio database
    const updateInfo = await portfolios().updateOne({ _id: id }, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return `Bought ${quant} stocks of ${ticker}.`;
    // return retId
}

// sell
async function sell(id, ticker, quant, threshold = 0, auto = false, interval = "1min") {
    id = validation.checkId(id, "Stock Portfolio ID")
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    threshold = validation.checkInt(threshold, "Threshold")
    auto = validation.checkBoolean(auto, "Auto Flag")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if (ticker.length > 5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if (interval != "1min" && interval != "5min" && interval != "15min" && interval != "30min" && interval != "60min") throw "Invalid Interval"
    let autoFlag = false
    let retId = ""

    // determine if during trading hours (9:30am - 4:00pm on weekdays)
    // if auto, don't throw an error, add to autoBuys collection, set awaiting to true 
    if (!duringTradingHours()) {
        if (auto) {
            autoFlag = true
            if (!awaiting) {
                awaiting = true
                setTimeout(autoTrade(), timeToOpen())
            }
            retId = await AwaitingTrade(id, "buy", ticker, quant, threshold)
        } else {
            throw "Unable to buy outside of trading hours"
        }
    }
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({ _id: id })
    if (!portfolio) throw "Stock Portfolio not found"

    // determine if holding ticker and enough shares
    if (!portfolio["stocks"][ticker]) throw "Not holding ticker"
    if (portfolio["stocks"][ticker] < quant) throw `Not holding enough of ${ticker}`

    // get the stock price from the api
    const price = await api.price(ticker, interval)

    if (!autoFlag) {
        // create a new transaction
        retId = await Transaction(id, "sell", ticker, quant, price * quant, getDate())
        // update the portfolio
        portfolio["balance"] += (price * quant)
        portfolio["stocks"][ticker] -= quant
        if (portfolio["stocks"][ticker] == 0) delete portfolio["stocks"][ticker]
        /*
        portfolio["stocks"][ticker]-=quant
        portfolio["stocks"].filter(stock => stock[Object.keys(stock)[0]]>0)
        */
        portfolio["transactions"].push(retId)
    } else { // if autoFlag, update autoSells field only
        portfolio["autoSells"].push(retId)
    }

    // update in portfolio database
    const updateInfo = await portfolios().updateOne({ _id: id }, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return `Sold ${quant} stocks of ${ticker}.`;
    // return retId /* Return an acknowledgement. */
}

/*
// autoBuy
async function autoBuy(ticker, quant, id) {
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    id = validation.checkId(id, "Stock Portfolio ID")
    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers

    // determine if during trading hours (9:30am - 4:00pm)
    // do not throw here
    if(!duringTradingHours()) {
        // add to awaitingTrades collection and return
        if(!awaiting) {
            awaiting = true
            setTimeout(autoTrade(), timeToOpen())
        }
        return await AwaitingTrade(id, "buy", ticker, quant)
    }

    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({_id: id})
    if(!portfolio) throw "Stock Portfolio not found"

    // get the stock price from the api
    const price = await api.price(ticker, interval)
    if((price*quant)>portfolio["current-balance"]) {
        // add to awaitingTrades collection and return
        if(!awaiting) {
            awaiting = true
            setTimeout(autoTrade(), timeToOpen())
        }
        return await AwaitingTrade(id, "buy", ticker, quant)
    }

    // stock can be bought
    return buy(ticker, quant, id)
}

// autoSell
async function autoSell(ticker, quant, id) {
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    id = validation.checkId(id, "Stock Portfolio ID")
    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers

    // determine if during trading hours (9:30am - 4:00pm)
    // do not throw here
    if(!duringTradingHours()) {
        // add to awaitingTrades collection and return
        if(!awaiting) {
            awaiting = true
            setTimeout(autoTrade(), timeToOpen())
        }
        return await AwaitingTrade(id, "sell", ticker, quant)
    }

    // // find stockPortfolio using id
    // let portfolio = await portfolios().findOne({_id: id})
    // if(!portfolio) throw "Stock Portfolio not found"

    // // determine if holding ticker and enough shares
    // if(!portfolio["stocks"][ticker]) throw "Not holding ticker"
    // if(portfolio["stocks"][ticker]<quant) throw `Not holding enough of ${ticker}`
    
    // // get the stock price from the api
    // const price = await api.price(ticker, interval)

    // stock can be sold
    return sell(ticker, quant, id)
}
*/

// autoTrade
async function autoTrade() {
    // check if during trading hours
    if (!duringTradingHours()) {
        setTimeout(autoTrade(), timeToOpen())
        return
    }

    // check if there are any awaiting trades
    let buyCount = await autoBuys().count()
    let sellCount = await autoSells().count()
    if ((buyCount + sellCount) > 0) {
        const buys = await autoBuys().find().toArray()
        const sells = await autoSells().find().toArray()
        for (let j = 0; j < sells.length; j++) {
            const trade = sells[j]
            try {
                await sell(trade["id"], trade["ticker"], trade["quant"], trade["threshold"])
            } catch (e) {
                continue
            }
            await autoSells().deleteOne({ _id: trade["_id"] })
        }
        for (let i = 0; i < buys.length; i++) {
            const trade = buys[i]
            try {
                await buy(trade["id"], trade["ticker"], trade["quant"], trade["threshold"])
            } catch (e) {
                continue
            }
            await autoBuys().deleteOne({ _id: trade["_id"] })
        }
        /*
        const trades = buys.concat(sells) // assumes empty collection will result in an empty array
        for(let i=0; i<trades.length; i++) {
            const trade = trades[i]
            if(trade["type"]=="buy") {
                try {
                    await buy(trade["ticker"], trade["quantity"], trade["portfolio_id"])
                } catch(e) { // unable to buy, do not delete
                    continue
                }
            } else if(trade["type"]=="sell") {
                try {
                    await sell(trade["ticker"], trade["quantity"], trade["portfolio_id"])
                } catch(e) { // unable to sell, do not delete
                    continue
                }
            }
            await awaitingTrades().deleteOne({_id: trade["_id"]})
        }
        */
    }

    buyCount = await autoBuys().count()
    sellCount = await autoSells().count()
    if ((buyCount + sellCount) > 0) {
        setTimeout(autoTrade(), (autoInterval * 60 * 1000))
    } else {
        awaiting = false
    }
    return
}

/**
 * Given a list of ids, return a list of transaction objects, where each _id corresponds to its object.
 * @param ids 
 * @returns list of transaction objects
 */
async function getTransactions(ids) {
    return ids.map( async (id) => { await transactions().findOne({ _id: id }) } )
}

module.exports = {
    buy,
    sell,
    priorities,
    getTransactions
}