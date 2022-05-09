const dbConnection = require('../config/mongoConnection');
const stockPortfolio = require('../data/stockPortfolio');
const users = require('../data/users');

const main = async () => {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    let newUser = await users.createUser("Bebo", "banana@gmail.com", "bebo", "banana", "none");
    // Don't need to create portfolio, happens upon signup
    
    console.log('Done seeding database');
    await dbConnection.closeConnection();
};

main().catch(console.log);
