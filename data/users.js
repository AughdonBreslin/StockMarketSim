const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async function createUser(username, password) {
    // Error Checking
    validation.checkNumOfArgs(arguments,2,2);
    validation.checkIsProper(username, 'string', 'username');
    // NOTE: Check usernames with spaces/non-alphanumeric characters
    validation.checkString(username, 4, 'username', true, false);
    validation.checkIsProper(password, 'string', 'password');
    // NOTE: Check passwords with length < 6
    validation.checkString(password, 6, 'password', false, false);
    // Formatting
    username = username.trim();
    username = username.toLowerCase();
    password = password.trim();

    // Get database
    const userCollection = await users();
    if(!userCollection) throw `Error: Could not find userCollection.`;

    // Check if user already exists
    const user = await userCollection.findOne({username: username});
    if(user) throw `Error: User already exists with username ${username}.`;
    
    // Encrypt password (done after checking user so we dont waste time)
    const hash = await bcrypt.hash(password, saltRounds);

    // Create entry
    let newUser = {
      username: username,
      password: hash
    };

    // Add entry into database
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw `Error: Could not add new user.`;    
    
    // Return acknowledgement
    return {userInserted: true};
}

const checkUser = async function checkUser(username, password) {
    // Error Checking
    validation.checkNumOfArgs(arguments,2,2);
    validation.checkIsProper(username, 'string', 'username');
    // NOTE: Check usernames with spaces/non-alphanumeric characters
    validation.checkString(username, 4, 'username', true, false);
    validation.checkIsProper(password, 'string', 'password');
    // NOTE: Check passwords with length < 6
    validation.checkString(password, 6, 'password', false, false);

    // Get database
    const userCollection = await users();
    if(!userCollection) throw `Error: Could not find userCollection.`;

    // Check if user exists
    const user = await userCollection.findOne({username: username});
    if(!user) throw `Error: Either the username or password is invalid.`;

    const hash = user.password;
    let match = false;
    try {
        match = await bcrypt.compare(password, hash);
    } catch (e) {
        // no shot this bitch will fail
        // they used to call this bad boy 'mr. ole reliable' back in highschool
    }

    // Failure
    if(!match) throw `Error: Either the username or password is invalid.`;
    
    // Success
    return {authenticated: match};
}

module.exports = {
    createUser,
    checkUser
}

