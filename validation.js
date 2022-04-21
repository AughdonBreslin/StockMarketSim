const checkNumOfArgs = function checkNumOfArgs(args, numArgsLow, numArgsHigh) {
  if(args.length < numArgsLow || args.length > numArgsHigh) throw (numArgsLow == numArgsHigh)
   ? ((numArgsLow == 1) 
      ? `Error: Exactly ${numArgsLow} argument must be provided.`
      : `Error: Exactly ${numArgsLow} arguments must be provided.`)
   : `Error: Number of arguments must be between ${numArgsLow} and ${numArgsHigh} (inclusive).`;
};

const checkIsProper = function checkIsProper (val, varType, variableName) {
  if(!val) throw `Error: ${variableName || 'Variable'} is not defined.`;
  // Check parameter type is correct (also checks if its defined)
  if (typeof val != varType) throw `Error: ${variableName || 'provided variable'} must be a ${varType}.`;

  // Also required to catch NaNs since theyre technically type 'number'
  if (varType == 'number' && isNaN(val)) throw `Error: ${variableName || 'provided variable'} must not be NaN.`;
  
  // For strings, check if trimmed string is empty
  if(varType == 'string' && val.trim().length < 1) throw (1 == 1)
   ? `Error: Trimmed ${variableName || 'provided variable'} cannot be empty.`
   : `Error: Trimmed ${variableName || 'provided variable'} must be at least ${length} characters long.`;
};

const checkArray = function checkArray(array, elemType, arrName) {
  if(!Array.isArray(array)) throw `Error: ${arrName} must be an array.`;
  if(array.length == 0) throw `Error: ${arrName} must not be empty.`;
  for (const elem of array) {
      checkIsProper(elem,elemType,`Within ${arrName}, ${elem}`);
  }
};

const checkInt = function checkInteger(num, numName) {
  checkIsProper(num, 'number', numName);
  if(isNaN(num) || !Number.isInteger(num)) throw `Error: ${numName} must be a valid integer.`;
}
const checkWithinBounds = function checkWithinBounds(num, lower, upper) {
  if(num < lower || num > upper) throw `Error: ${numName} must be within [${lower}, ${upper}].`;
}

const checkWebsite = function checkWebsite(website) {
  if (website.indexOf('http://www.') != 0) throw `Error: Website ${website} must begin with 'http://www.'.`;
  if (website.indexOf('.com') == -1
      || website.substr(website.indexOf('.com')+4) != "") throw `Error: Website ${website} must end in with '.com'.`;
  if (website.length < 20) throw `Error: There must be at least 5 characters in between 'http://www.' and '.com'.`
};

const checkYear = function checkYear(year) {
  if (!Number.isInteger(year)) throw `Error: Year must be an integer.`;
  if (year < 1900 || year > 2022) throw `Error: Year must be within the range [1900,2022].`;
};

const checkTracks = function checkTracks(array, elemType, arrName) {
  if(!Array.isArray(array)) throw `Error: ${arrName} must be an array.`;
  if(array.length < 3) throw `Error: ${arrName} must contain at least three tracks.`;
  for (const elem of array) {
      checkIsProper(elem,elemType,`Within ${arrName}, ${elem}`);
  }
}

const checkRelease = function checkRelease(date) {
  if (date.length != 10) throw `Error: Release date must be in form 'MM/DD/YYYY'.`;
  let year = parseInt(date.substr(-4));
  if (isNaN(year) || !Number.isInteger(year) || year < 1900 || year > 2023) throw `Error: Year must be a number within the range [1900,2023].`;
}
const checkRating = function checkRating(rating) {
  if(rating < 1 || rating > 5) throw `Error: Rating must be a number within the range [1,5].`;
}

const trimArray = function trimArray(array) {
  for (i in array) {
      array[i] = array[i].trim();
  }
  return array;
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

const checkString = function checkString(strVal, length, varName, alphanumeric=false, spacesOk=true) {
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
module.exports = {
  checkId,
  checkInt,
  checkWithinBounds,
  checkString,
  checkNumOfArgs,
  checkIsProper,
  checkArray,
  checkWebsite,
  checkYear,
  trimArray,
  checkRating,
  checkRelease,
  checkTracks
};
