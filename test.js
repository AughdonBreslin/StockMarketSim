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
    try {
        const result = await transactions.buy("6278298ba1eb25c069188944", "GOOG", 1, )
    } catch(e) {
        console.log(e)
    }
}

test()