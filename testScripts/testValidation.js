const validation = require('../validation');

//
console.log('CheckNumArgs');
try {
    const args = [];
    validation.checkNumOfArgs(args, -1, 0);
    console.log("Failed: Shouldn't take -1 as an argument.");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    const args = [];
    validation.checkNumOfArgs(args, -1, -1);
    console.log("Failed: Shouldn't take -1 as an argument.");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    const args = [];
    validation.checkNumOfArgs(args, 1, 1);
    console.log("Failed: Shouldn't take 1 as an argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    const args = [];
    validation.checkNumOfArgs(args, 0, 0);
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    const args = [1];
    validation.checkNumOfArgs(args, 0, 2);
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    const args = [1];
    validation.checkNumOfArgs(args, 1, 1);
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    const args = [1];
    validation.checkNumOfArgs(args, 0, 1);
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    const args = [1];
    validation.checkNumOfArgs(args, 1, 2);
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

//-------------------checkIsProper----------------------
console.log('checkIsProper');
try {
    validation.checkIsProper(null, 'string' ,'Test 1');
    console.log('Failed: val is not defined');
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(null, 'number' ,'Test 2');
    console.log('Failed: val is not defined');
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(5, 'string' ,'Test 3');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper('5', 'number' ,'Test 4');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper('5', 'object' ,'Test 5');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(1, 'boolean' ,'Test 6');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(NaN, 'string' ,'Test 7');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(NaN, 'number' ,'Test 8');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(NaN, 'number' ,'Test 9');
    console.log("Failed: val can't be NaN!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper("", 'number' ,'Test 10');
    console.log("Failed: val type doesn't match second argument!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper("", 'string' ,'Test 11');
    console.log("Failed: val cannot be an empty string!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper("     ", 'string' ,'Test 12');
    console.log("Failed: val cannot be a bunch of spaces!");
} catch (e) {
    console.log(`Success: ${e}`);
}

try {
    validation.checkIsProper(0, 'number' ,'Test 13');
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    validation.checkIsProper("Hello world!", 'string' ,'Test 14');
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    validation.checkIsProper("    Hello world!     ", 'string' ,'Test 14');
    console.log("Success!");
} catch (e) {
    console.log(`Failed: ${e}`);
}

try {
    validation.checkIsProper(e, 'number' ,'Test 14');
    console.log("Failed: Can't use e!");
} catch (e) {
    console.log(`Success: ${e}`);
}

//----------------checkArray--------------------------
console.log('checkArray()');
try {
    
} catch (e) {
    
}

//----------------------checkInt()------------------


//------------------checkWithinBounds---------------------


//-----------------------checkMoneyAmt--------------------

//-----------------------checkWebsite-----------------------

//-------------------------checkYear------------------------

//