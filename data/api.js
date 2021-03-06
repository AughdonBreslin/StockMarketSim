const axios = require('axios')
const { application } = require('express')
const { ObjectId } = require('mongodb')
const mongoCollections = require('../config/mongoCollections')
const portfolios = mongoCollections.portfolios
const validation = require('../validation')
const key = "FN6CRSE4MHKTRH4X"

let awaiting = false

// price(ticker)
async function price(ticker, interval="1min") {
    // validate ticker and interval
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    interval = validation.checkString(interval, 1, "Interval", true, false)

    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if(interval.length!==4 && interval.length!==5) throw "Invalid Interval"
    if(interval !== "1min" && interval !== "5min" && interval !== "15min" && interval !== "30min" && interval !== "60min") throw "Interval is invalid"
    
    // use an axios request to get the price, may change this to ajax
    const {data} = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=${interval}&apikey=${key}`)
    
    // check if the ticker was invalid
    if(data["Error Message"]) throw "Invalid Ticker"
    
    // check if ticker was the same as the one requested
    if(data["Meta Data"]["2. Symbol"] !== ticker) throw "Ticker Mismatch"
    
    // get the most recent stock price
    const prices = data[`Time Series (${interval})`]
    const mostRecent = prices[Object.keys(prices)[0]]
    
    // return the price
    return Number(mostRecent["4. close"])
}

// history(ticker, interval)
async function dailyHistory(ticker) {
    ticker = (validation.checkString(ticker, 1, "Ticker", true, false)).toUpperCase()
    const {data} = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${key}`)
    if(data["Error Message"]) throw "Invalid Ticker"
    if(data["Meta Data"]["2. Symbol"] !== ticker) throw "Ticker Mismatch"
    return data
}

// pval(id)
async function pval(id) {
    // validate id
    id = validation.checkId(id, "Stock Portfolio ID")

    // get the portfolio
    const portfolioCollection = await portfolios()
    const portfolio = await portfolioCollection.findOne({_id: ObjectId(id)})
    if(!portfolio) throw "Portfolio not found"
    
    // calculate total value of stocks
    let total = 0
    for(let i=0; i<portfolio["stocks"].length; i++) {
        let pr = await price(portfolio["stocks"][i][0])
        total += (pr * portfolio["stocks"][i][1])
    }

    // update the portfolio
    portfolio["previousValue"] = portfolio["value"]
    portfolio["value"] = portfolio["balance"]+total
    const updateInfo = await portfolioCollection.updateOne({"_id": ObjectId(id)}, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"]) throw "Portfolio was not updated"

    return portfolio["value"]

    /*
    // validate stocks
    if(!stocks) throw "No stocks provided"
    if(typeof stocks !== 'object') throw "Stocks is not an object"
    
    // get the price of each stock
    let total = 0
    const tickers = Object.keys(stocks)
    for(let i=0; i<tickers.length; i++) {
        total+=((await price(tickers[i], "1min"))*stocks[tickers[i]])
    }
    
    console.log("pval: "+total); // debugging purposes only
    return total
    */
}

/*
// timeToFour
function timeToFour() {
    let hours = 0
    let minutes = 0
    let seconds = 0
    const date = new Date()

    // find time to 16
    // get time to hour first
    minutes = 60 - date.getMinutes()
    if (date.getSeconds() != 0) {
        minutes--
        seconds = 60 - date.getSeconds()
    }

    // check if hour is before/after 9
    if (date.getHours() > 16) {
        hours = 24 - date.getHours() + 16
    } else {
        hours = 16 - date.getHours()
    }

    // adjust for minutes
    if (!(minutes == 0 && seconds == 0)) {
        hours--
    }

    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000
}

// updateDailyValues
async function updateDailyValues(id) {
    // validate id
    id = validation.checkId(id, "Stock Portfolio ID")    

    // get the portfolio
    const portfolioCollection = await portfolios()
    const portfolio = await portfolioCollection.findOne({_id: ObjectId(id)})
    if(!portfolio) throw "Portfolio not found"

    if (portfolio["dailyValues"].length) {
        // get most recent DailyValue
        const latest = portfolio["dailyValues"][portfolio["dailyValues"].length-1][0]
        
        // check if day, month, and year are the same
        const date = new Date()
        if(!awaiting && latest.getDate() === date.getDate() && latest.getMonth() === date.getMonth() && latest.getFullYear() === date.getFullYear()) {
            awaiting = true
            setTimeout(function() {updateDailyValues(id)}, timeToFour())
        }
    }

    // update the portfolio
    let val = await pval(id)
    portfolio["dailyValues"].push([new Date(), val])
    const updateInfo = await portfolioCollection.updateOne({"_id": ObjectId(id)}, { $set: portfolio })
    if (!updateInfo["acknowledged"] || !updateInfo["matchedCount"] || !updateInfo["modifiedCount"]) throw "Portfolio was not updated"
}
*/

module.exports = {
    price,
    dailyHistory,
    pval
}