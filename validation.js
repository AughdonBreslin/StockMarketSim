

let checkValidNumArgs = (numArgsGiven, numArgsExpected) => {
    if (numArgsGiven != numArgsExpected) {
        throw `Error: Given ${numArgsGiven} arguments, but expected ${numArgsExpected} arguments.`;
    }
};

let checkIfValidStr = (val, name, emptyAllowed = false) => {
    if (!val) {
        throw `Error: ${name} is null, undefined, or empty.`;
    }

    if (typeof val !== 'string') {
        throw `Error: ${name} must be a string.`;
    }

    let trimmed_id = val.trim();

    if (!emptyAllowed && trimmed_id.length == 0) {
        throw `Error: ${name} cannot be an empty string.`;
    }

    return trimmed_id;

};

// throws exception if elem is not a proper number
let checkIfElemIsNumber = (elem, mustBeInteger, min_allowed, max_allowed) => {

    // Check if elem is a number (catches if elem is null or undefined)
    if (typeof elem !== "number") {
        throw "Not a number.";
    }

    // Check if NaN
    if (isNaN(elem)) {
        throw "Element is NaN.";
    }

    if (mustBeInteger && !Number.isInteger(elem)) {
        throw "Number is not an integer.";
    }

    if (elem < min_allowed || elem > max_allowed) {
        throw "Number is out of range.";
    }

};

let checkStrHasOnlyDigits = (elem, label) => {
    for (let i = 0; i < elem.length; i++) {
        if (elem[i] < '0' || elem[i] > '9') {
            throw `Error ${label} must contain numbers only.`;
        }
    }
};


module.exports = {
    checkValidNumArgs, checkIfValidStr, checkIfElemIsNumber, checkStrHasOnlyDigits
};