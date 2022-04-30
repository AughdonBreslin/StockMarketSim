const dataFunctions = require('../data');
const connection = require('../config/mongoConnection');
const { ObjectId } = require('mongodb');
const users = dataFunctions.users;
const stockPort = dataFunctions.stockPortfolio;

const main = async function main() {

    let user1, user2, user3, user4;
    //Testing users.js
    console.log("--------------Testing users.js data functions!----------------");
    console.log("-----createUser()-----");
    try {
        user1 = await users.createUser("Ella Crabtree", "ecrabtre@stevens.edu", "ellacrabtree", "sandikalulu", "none");
        console.log(`Success! User1 created!`);
    } catch (e) {
        console.log(`Failed: ${e}`)
    }

    try {
        user2 = await users.createUser("Ella Crabtree", "ecrabtre@stevens.edu", "ellacrabtree", "sandikalulu", "none");
        console.log(`Failed! User already created!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("Odin Crabtree", "ecrabtre@stevens.edu", "odincrabtree", "sandikalulu", "weekly");
        console.log(`Failed! User already created!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree", "willcrab@stevens.edu", "willcrabtree", "elarbolgrande", "");
        console.log(`Failed! User needs to specify email updates!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree", "willcrab@stevens.edu", "willcrabtree", "elarbolgrande");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree", "willcrab@stevens.edu", "willcrabtree");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree", "willcrab@stevens.edu");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("William Crabtree", "willcrab@stevens.edu", "willcrabtree", "elarbolgrande", "daily34");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }

    try {
        user2 = await users.createUser("    William Crabtree    ", "    willcrab@stevens.edu    ", "    willcrabtree    ", "   elarbolgrande   ", "    monthly  ");
        console.log(`Success!`);
        console.log(user2);
    } catch (e) {
        console.log(`Failed: ${e}`)
    }

    try {
        user2 = await users.getUser(user2._id);
        console.log(`Success!`);
        console.log(user2);
    } catch (e) {
        console.log(`Failed: ${e}`)
    }



    try {
        user3 = await users.createUser("William Crabtree", "willcrab@stevens.edu", "   will crabtree   ", "elarbolgrande", "");
        console.log(`Failed!`);
    } catch (e) {
        console.log(`Success: ${e}`)
    }


    const db = await connection.connectToDb();
    await connection.closeConnection();
    console.log('Done!');
}

main().catch((error) => {
    console.log(error);
});
