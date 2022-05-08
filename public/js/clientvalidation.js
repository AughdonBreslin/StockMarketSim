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

  const checkEmail = function checkEmail(email, varName) {

    if (!email) throw `Error: You must provide a ${varName}`;
    if (typeof email !== 'string') throw `Error: ${varName} must be a string!`;
    let newEmail = email.trim();
    if (newEmail.length === 0) throw `Error: ${varName} cannot be an empty string or just spaces`;
  
    const amp = newEmail.indexOf('@');
  
    if (amp === -1) throw `Error: ${varName} does not have an @`;
    if (newEmail.substring(0, amp).includes('@')) throw `Error: ${varName} has an extra @`;
  
    const emailDomain = newEmail.substring(amp);
  
    // const emailValidator = require("email-validator");
    // if (!emailValidator.validate(newEmail)) throw `Error: ${varName} not a valid email address!`;
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
  const checkFreq = function checkFreq(freq) {
    if (freq == null || freq == undefined) throw `Error: frequency is null or undefined, but must be a string!`;
    if (typeof freq !== 'string') throw `Error: frequency must be a string!`;
  
    const valid_freqs = ["none", "daily", "weekly", "monthly"];
    freq = freq.trim().toLowerCase();
  
    if (valid_freqs.includes(freq)) {
    } else {
      throw `Error: Invalid auto-deposit frequency. Check input!`;
    }
  
  };

// module.exports = {
//     checkIsProper,
//     checkEmail,
//     checkString,
//     checkFreq
// }