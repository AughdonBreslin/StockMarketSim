const axios = require('axios')
const key = "FN6CRSE4MHKTRH4X"

// price(ticker)
async function price(ticker, interval) {
    // validate ticker and interval
    if(!ticker) throw "No ticker provided"
    if(!interval) throw "No interval provided"
    if(typeof ticker !== 'string') throw "Ticker is not a string"
    if(typeof interval !== 'string') throw "Interval is not a string"
    ticker = ticker.trim()
    interval = interval.trim()
    if(!ticker.length) throw "Ticker is empty"
    if(!interval.length) throw "Interval is empty" 
    if(ticker.length>5) throw "Invalid Ticker" // May want to change 5 if there are longer tickers
    if(interval.length!==4 && interval.length!==5) throw "Invalid Interval"
    // tickers cannnot be longer than 5 characters and must be alphanumeric
    const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    ticker = ticker.toUpperCase()
    for(let i=0; i<ticker.length; i++) {
        if(!alphanumeric.includes(ticker[i])) throw "Invalid Ticker"
    }
    // intervals can only be 1min, 5min, 15min, 30min, 60min
    interval = interval.toLowerCase()
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
    console.log(`${ticker}: `+Number(mostRecent["4. close"])) // debugging purposes only
    return Number(mostRecent["4. close"])
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
    console.log(total) // debugging purposes only
    return total
}