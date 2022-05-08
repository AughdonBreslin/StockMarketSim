const transactions = require('./data/transactions');

// console.log(duringTradingHours())
// console.log(timeToOpen())

async function test() {
    // try {
    //     const result = await transactions.buy("6278298ba1eb25c069188944", "GOOG", 1, true)
    // } catch(e) {
    //     console.log(e)
    // }
    // try {
    //     const result = await transactions.sell("6278298ba1eb25c069188944", "GOOG", 1, true)
    // } catch(e) {
    //     console.log(e)
    // }

    // try {
    //     const result = await transactions.buy("6278298ba1eb25c069188944", "GOOG", 1, false, 2500, 1, true)
    // } catch(e) {
    //     console.log(e)
    // }
    // try {
    //     const result = await transactions.buy("6278298ba1eb25c069188944", "AMZN", 1, false, 2500, 1, true)
    // } catch(e) {
    //     console.log(e)
    // }
    try {
        const result = await transactions.sell("6278298ba1eb25c069188944", "GOOG", 1, false, 5000, true)
    } catch(e) {
        console.log(e)
    }
}

test()