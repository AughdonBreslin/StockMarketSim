const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async function createUser(fullName, email, username, password, emailUpdates) {
    // Error Checking
    validation.checkNumOfArgs(arguments,5,5);

    //Checking if arguments are of appropriate type
    validation.checkIsProper(fullName, 'string', 'First name');
    validation.checkIsProper(email, 'string', 'Email');
    validation.checkIsProper(username, 'string', 'username');
    validation.checkIsProper(password, 'string', 'password');
    validation.checkIsProper(emailUpdates, 'string', 'Email updates');

    //Trim strings + toLowerCase - Formatting
    let tFullName = fullName.trim();

    let tEmail = email.trim();
    tEmail = tEmail.toLowerCase();

    let tUsername = username.trim();
    tUsername = tUsername.toLowerCase();

    let tPassword = password.trim();
    
    let tEmailUpdates = emailUpdates.trim();
    tEmailUpdates = tEmailUpdates.toLowerCase();

    //Check if email update selection is a valid selection
    if (tEmailUpdates !== 'none' && tEmailUpdates !== 'hourly' && tEmailUpdates !== 'daily' && tEmailUpdates !== 'weekly' && tEmailUpdates !== 'monthly') {
        throw `Error: Not a valid email update option!`;
    }

    // NOTE: Check usernames with spaces/non-alphanumeric characters
    validation.checkString(tUsername, 4, 'username', true, false);
    
    // NOTE: Check passwords with length < 6
    validation.checkString(tPassword, 6, 'password', false, false);

    //Check if email is a valid address (throw errors if otherwise)
    validation.checkEmail(tEmail);

    // Get database
    const userCollection = await users();
    if(!userCollection) throw `Error: Could not find userCollection.`;

    // Check if user already exists
    const user1 = await userCollection.findOne({username: tUsername});
    if(user1) throw `Error: User already exists with username ${tUsername}.`;

    //Check if email has already been used
    const user2 = await userCollection.findOne({email: tEmail});
    if (user2) throw `Error: Email ${tEmail} is already in use!`
    
    // Encrypt password (done after checking user so we dont waste time)
    const hash = await bcrypt.hash(tPassword, saltRounds);

    const dateCreated = new Date();
    // Create entry
    let newUser = {
        fullName: tFullName,
        email: tEmail,
        username: tUsername,
        hashedPassword: hash,
        emailUpdates: tEmailUpdates,
        lastUpdate: dateCreated,
        firstTimeLogIn: false
    };

    // Add entry into database
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw `Error: Could not add new user.`;    
    
    // Return user json
    return {userInserted: true}
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


    const tUsername = username.trim().toLowerCase();
    const tPassword = password.trim();

    const passwordHash = await bcrypt.hash(tPassword, saltRounds);

    // Get database
    const userCollection = await users();
    if(!userCollection) throw `Error: Could not find userCollection.`;

    // Check if user exists
    const user = await userCollection.findOne({username: tUsername});
    if(!user) throw `Error: Either the username or password is invalid.`;
    
    const hash = user.hashedPassword;
    let match = false;
    try {
        match = bcrypt.compare(passwordHash, hash);
    } catch (e) {
        
    }
    // Failure
    if(!match) throw `Error: Either the username or password is invalid.`;
    
    // Success

    user._id = user._id.toString();

    return {user: user, authenticated: match};
}

const getUser = async function getUser(userId) {

    //Check number of arguments
    validation.checkNumOfArgs(arguments, 1, 1);

    //Check if valid id
    validation.checkId(userId, 'User ID');

    const newUserId = userId.trim();

    const userCollection = await users();
    if(!userCollection) throw `Error: Could not find userCollection.`;

    const user = await userCollection.findOne({_id: ObjectId(newUserId)});
    if (!user) throw `Error: User could not be found!`;

    user._id = newUserId;
    return user;
}

module.exports = {
    createUser,
    checkUser,
    getUser
}

