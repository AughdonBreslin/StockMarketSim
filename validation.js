const { ObjectId } = require('mongodb');

const checkNumOfArgs = function checkNumOfArgs(args, numArgsLow, numArgsHigh) {

  if (numArgsLow < 0 || numArgsHigh < 0) throw `Error: Neither argument bound can be negative!`;

  if (args.length < numArgsLow || args.length > numArgsHigh) throw (numArgsLow == numArgsHigh)
    ? ((numArgsLow == 1)
      ? `Error: Exactly ${numArgsLow} argument must be provided.`
      : `Error: Exactly ${numArgsLow} arguments must be provided.`)
    : `Error: Number of arguments must be between ${numArgsLow} and ${numArgsHigh} (inclusive).`;
};

const checkIsProper = function checkIsProper(val, varType, variableName) {
  if (!val && varType !== 'number') throw `Error: ${variableName || 'Variable'} is not defined.`;
  // Check parameter type is correct (also checks if its defined)
  if (typeof val != varType) throw `Error: ${variableName || 'provided variable'} must be a ${varType}.`;

  // Also required to catch NaNs since theyre technically type 'number'
  if (varType == 'number' && isNaN(val)) throw `Error: ${variableName || 'provided variable'} must not be NaN.`;

  // For strings, check if trimmed string is empty
  if (varType == 'string' && val.trim().length < 1) throw (1 == 1)
    ? `Error: Trimmed ${variableName || 'provided variable'} cannot be empty.`
    : `Error: Trimmed ${variableName || 'provided variable'} must be at least ${length} characters long.`;
};

const checkArray = function checkArray(array, elemType, arrName) {
  if (!Array.isArray(array)) throw `Error: ${arrName} must be an array.`;
  if (array.length == 0) throw `Error: ${arrName} must not be empty.`;
  for (const elem of array) {
    checkIsProper(elem, elemType, `Within ${arrName}, ${elem}`);
  }
};

const checkInt = function checkInteger(num, numName) {
  checkIsProper(num, 'number', numName);
  if (isNaN(num) || !Number.isInteger(num)) throw `Error: ${numName} must be a valid integer.`;
}

const checkBool = function checkBool(bool, varName) {
  if (!bool && bool !== false) throw `Error: ${varName} is not defined.`;
  if (typeof bool !== 'boolean') throw `Error: ${varName} must be a boolean.`;
  return bool;
}

const checkWithinBounds = function checkWithinBounds(num, lower, upper) {
  if (num < lower || num > upper) throw `Error: ${numName} must be within [${lower}, ${upper}].`;
}

const checkMoneyAmt = function checkMoneyAmt(num, numName, negatives) {

  if (arguments.length != 3) throw `There are not enough arguments for this function!`

  if (typeof num !== 'number' && typeof num !== 'string') throw `Error: ${numName} not of type number or string!`

  let newNum = num.toString();
  if (newNum.trim().length === 0) throw `Error: ${varName} cannot be empty or just spaces!`

  newNum = newNum.trim();

  if (newNum.charAt(0) == '$') {
    newNum = newNum.substring(1);
  } else if (newNum.charAt(newNum.length - 1) == '$') {
    newNum = newNum.substring(0, num.trim().length - 1);
  }

  if (newNum.includes('.') && newNum.split('.')[1].length > 2) throw `Error: ${numName} cannot have 3 point precision!`;

  newNum = Number(newNum);

  if (isNaN(newNum)) throw `Error: ${numName} is an invalid number!`;

  if (!negatives && newNum < 0) throw `Error: ${numName} cannot be a negative amount!`;

  return newNum;
}

const checkWebsite = function checkWebsite(website) {
  if (website.indexOf('http://www.') != 0) throw `Error: Website ${website} must begin with 'http://www.'.`;
  if (website.indexOf('.com') == -1
    || website.substr(website.indexOf('.com') + 4) != '') throw `Error: Website ${website} must end in with '.com'.`;
  if (website.length < 20) throw `Error: There must be at least 5 characters in between 'http://www.' and '.com'.`
};

const checkYear = function checkYear(year) {
  if (!Number.isInteger(year)) throw `Error: Year must be an integer.`;
  if (year < 1900 || year > 2022) throw `Error: Year must be within the range [1900,2022].`;
};

// const checkTracks = function checkTracks(array, elemType, arrName) {
//   if(!Array.isArray(array)) throw `Error: ${arrName} must be an array.`;
//   if(array.length < 3) throw `Error: ${arrName} must contain at least three tracks.`;
//   for (const elem of array) {
//       checkIsProper(elem,elemType,`Within ${arrName}, ${elem}`);
//   }
// }

// const checkRelease = function checkRelease(date) {
//   if (date.length != 10) throw `Error: Release date must be in form 'MM/DD/YYYY'.`;
//   let year = parseInt(date.substr(-4));
//   if (isNaN(year) || !Number.isInteger(year) || year < 1900 || year > 2023) throw `Error: Year must be a number within the range [1900,2023].`;
// }
// const checkRating = function checkRating(rating) {
//   if(rating < 1 || rating > 5) throw `Error: Rating must be a number within the range [1,5].`;
// }

const trimArray = function trimArray(array) {
  for (i in array) {
    array[i] = array[i].trim();
  }
  return array;
};

const checkEmail = function checkEmail(email, varName) {

  if (!email) throw `Error: You must provide a ${varName}`;
  if (typeof email !== 'string') throw `Error: ${varName} must be a string!`;
  let newEmail = email.trim();
  if (newEmail.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`;

  const amp = newEmail.indexOf('@');

  if (amp === -1) throw `Error: ${varName} does not have an @`;
  if (newEmail.substring(0, amp).includes('@')) throw `Error: ${varName} has an extra @`;

  const emailDomain = newEmail.substring(amp);

  const emailValidator = require("email-validator");
  if (!emailValidator.validate(newEmail)) throw `Error: ${varName} not a valid email address!`;
};

const checkId = function checkId(id, varName) {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};

const checkString = function checkString(strVal, length, varName, alphanumeric = false, spacesOk = true) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length < length)
    throw `Error: Trimmed ${varName} must be at least ${length} characters long.`;
  if (!spacesOk && strVal.includes(' '))
    throw `Error: ${varName} cannot contain spaces.`;
  strVal = strVal.toLowerCase();
  // Check if all characters fall within 0-9 and a-z
  if (alphanumeric && !strVal.match(/^[0-9a-z]+$/))
    throw `Error: ${varName} must be alphanumeric.`;
  return strVal;
};


/** Returns the auto deposit frequency if input is valid. Otherwise, throws error */
const checkAutoDepFreq = function checkAutoDepFreq(freq) {
  if (freq == null || freq == undefined) throw `Error: frequency is null or undefined, but must be a string!`;
  if (typeof freq !== 'string') throw `Error: frequency must be a string!`;

  const valid_freqs = ["none", "daily", "weekly", "monthly"];
  freq = freq.trim().toLowerCase();

  if (valid_freqs.includes(freq)) {
    return freq;
  } else {
    throw `Error: Invalid auto-deposit frequency. Check input!`;
  }

};

const checkInsufficientFundOption = function checkInsufficientFundOption(option) {
  if (option == null || option == undefined) throw `Error: Insufficient Fund option is null or undefined!`;

  if (typeof option === 'boolean') return option;

  if (typeof option !== 'string') throw `Error: Insufficient Funds Option must be either a string or a boolean!`;
  option = option.trim().toLowerCase();

  if (option.length == 0) throw `Error: Insufficient Funds Option cannot be an empty string`;

  if (option === 'true') return true;
  if (option === 'false') return false;
};

const checkDate = function checkDate(date) {
  if(!date) throw `Error: Date is null or undefined!`;
  if(!(date instanceof Date)) throw `Error: Date must be a Date object!`;
  return date;
}

module.exports = {
  checkId,
  checkInt,
  checkBool,
  checkWithinBounds,
  checkString,
  checkNumOfArgs,
  checkIsProper,
  checkArray,
  checkWebsite,
  checkDate,
  checkYear,
  trimArray,
  // checkRating,
  // checkRelease,
  // checkTracks,
  checkEmail,
  checkMoneyAmt,
  checkAutoDepFreq,
  checkInsufficientFundOption
};
