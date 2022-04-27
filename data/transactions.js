const mongoCollections = require('../config/mongoCollections')
const portfolios = mongoCollections.portfolios
const autoBuys = mongoCollections.autoBuys
const autoSells = mongoCollections.autoSells
const transactions = mongoCollections.transactions
const awaitingTrades = mongoCollections.awaitingTrades
const validation = require('../validation')
const api = require('./api')
const interval = 15 // possible to set from stockmarketsettings

let awaiting = false

// getDate
function getDate() {
    let date = new Date()  
    date = date.toLocaleString('en-US', {timeZone: 'America/New_York'})
    return date
}

// duringTradingHours
function duringTradingHours() {
    const date = getDate()
    if(date.getDay()>0 && date.getDay()<6) { // weekday
        if((date.getHours()==9 && date.getMinutes()>=30) || (date.getHours()>9 && date.getHours()<16)) { // Between 9:30 AM and 4:00 PM
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

    if(duringTradingHours()) return 0

    if(date.getHours()>=16) {
        hours = 24-date.getHours()-1
        if(!(date.getMinutes()==0 && date.getSeconds()==0)) {
            minutes = 60-date.getMinutes()-1
            if(date.getSeconds()!=0) {
                seconds = 60-date.getSeconds()
            } else {
                minutes++
            }         
        } else {
            hours++
        }
        hours+=9
        minutes+=30
    } else { // get time to 10 then subtract 30 minutes
        hours = 10-date.getHours()-1
        if(!(date.getMinutes()==0 && date.getSeconds()==0)) {
            minutes = 60-date.getMinutes()-1
            if(date.getSeconds()!=0) {
                seconds = 60-date.getSeconds()
            } else {
                minutes++
            }         
        } else {
            hours++
        }
        if(minutes<30) {
            hours--
            minutes+=30
        } else {
            minutes-=30
        }
    }

    return ((hours*60*60)+(minutes*60)+seconds)*1000
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
    if(!insertInfo["acknowledged"] || !insertInfo["insertedId"]) throw "transaction was not inserted"
    id = insertInfo["insertedId"].toString() 
    return id
}

// AwaitingTrade
async function AwaitingTrade(id, type, ticker, quant) {
    //validate all inputs

    const awaitingTrade = {
        "portfolio_id": id,
        "type": type,
        "ticker": ticker,
        "quantity": quant
    }
    const insertInfo = await awaitingTrades().insertOne(awaitingTrade)
    if(!insertInfo["acknowledged"] || !insertInfo["insertedId"]) throw "awaitingTrade was not inserted"
    id = insertInfo["insertedId"].toString()
    return id
}

// buy
async function buy(ticker, quant, id, interval="1min") {
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    id = validation.checkId(id, "Stock Portfolio ID")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if(interval!="1min" && interval!="5min" && interval!="15min" && interval!="30min" && interval!="60min") throw "Invalid Interval"

    // determine if during trading hours (9:30am - 4:00pm)
    if(!duringTradingHours()) throw "Unable to buy outside of trading hours"
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({_id: id})
    if(!portfolio) throw "Stock Portfolio not found"

    // get the stock price from the api
    const price = await api.price(ticker, interval)
    if((price*quant)>portfolio["current-balance"]) throw "Insufficient Funds"

    // create a new transaction
    const transaction_id = await Transaction(id, "buy", ticker, quant, price*quant, getDate())

    // update the portfolio
    portfolio["balance"]-=(price*quant)
    const tickers = portfolio["stocks"].map(stock => Object.keys(stock)[0])
    if(tickers.includes(ticker)) {
        portfolio["stocks"][tickers.indexOf(ticker)][ticker]+=quant
    } else {
        portfolio["stocks"].push({[ticker]:quant})
    }
    portfolio["stocks"].push({ticker: quant})
    portfolio["transactions"].push(transaction_id)

    // update in portfolio database
    const updateInfo = await portfolios().updateOne({_id: id}, {$set: portfolio})
    if(!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return transaction_id
}

// sell
async function sell(ticker, quant, id, interval="1min") {
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    quant = validation.checkInt(quant, "Quantity")
    id = validation.checkId(id, "Stock Portfolio ID")
    interval = validation.checkString(interval, 1, "Interval", true, false)
    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if(interval!="1min" && interval!="5min" && interval!="15min" && interval!="30min" && interval!="60min") throw "Invalid Interval"

    // determine if during trading hours (9:30am - 4:00pm)
    if(!duringTradingHours()) throw "Unable to sell outside of trading hours"
    // may want to add this to an awaiting trades collection (use setTimeout)

    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({_id: id})
    if(!portfolio) throw "Stock Portfolio not found"

    // determine if holding ticker and enough shares
    if(!portfolio["stocks"][ticker]) throw "Not holding ticker"
    if(portfolio["stocks"][ticker]<quant) throw `Not holding enough of ${ticker}`

    // get the stock price from the api
    const price = await api.price(ticker, interval)

    // create a new transaction
    const transaction_id = await Transaction(id, "sell", ticker, quant, price*quant, getDate())

    // update the portfolio
    portfolio["balance"]+=(price*quant)
    portfolio["stocks"][ticker]-=quant
    portfolio["stocks"].filter(stock => stock[Object.keys(stock)[0]]>0)
    portfolio["transactions"].push(transaction_id)

    // update in portfolio database
    const updateInfo = await portfolios().updateOne({_id: id}, {$set: portfolio})
    if(!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "portfolio was not updated"

    // unsure what to return
    return transaction_id
}

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

    /*
    // find stockPortfolio using id
    let portfolio = await portfolios().findOne({_id: id})
    if(!portfolio) throw "Stock Portfolio not found"

    // determine if holding ticker and enough shares
    if(!portfolio["stocks"][ticker]) throw "Not holding ticker"
    if(portfolio["stocks"][ticker]<quant) throw `Not holding enough of ${ticker}`
    
    // get the stock price from the api
    const price = await api.price(ticker, interval)
    */

    // stock can be sold
    return sell(ticker, quant, id)
}

// autoTrade
async function autoTrade() {
    // check if during trading hours
    if(!duringTradingHours()) {
        setTimeout(autoTrade(), timeToOpen())
        return
    }

    // check if there are any awaiting trades
    const count = await awaitingTrades().count()
    if(count>0) {
        const trades = await awaitingTrades().find().toArray()
        if(!trades) throw "Unable to retrieve awaiting trades"
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
    }

    count = await awaitingTrades().count()
    if(count) {
        setTimeout(autoTrade(), (interval*60*1000))
    }
    return
}

module.exports = {
    buy,
    sell,
    autoBuy,
    autoSell
}