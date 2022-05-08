const axios = require('axios')
const validation = require('../validation')
const key = "FN6CRSE4MHKTRH4X"

// price(ticker)
async function price(ticker, interval) {
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
    // console.log(`${ticker}: `+Number(mostRecent["4. close"])) // debugging purposes only
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

// pval(stocks)
async function pval(stocks) {
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
}

module.exports = {
    price,
    dailyHistory,
    pval
}