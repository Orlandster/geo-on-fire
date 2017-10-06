import GofBasicValidation from "../validators/basic.validation"

/**
 * 
 * @param {number} startAt The entry to start at.
 * @param {number} endAt The etnry to end at.
 * @param {string} fName The name of the executed function.
 */
export default function validateEntryLimitationParameters(startAt, endAt, fName) {
  // undefined is a possible value
  if (endAt) {
    // validate endAt first to make sure it contains a number
    validateEndAt(endAt, fName, "endAt");
  }
  validateStartAt(startAt, endAt, fName, "startAt");
}

/**
 * 
 * @param {number} startAt The number of the entry to start at.
 * @param {number} endAt The number of the entry to end at.
 * @param {string} fName The name of the executed function.
 * @param {string} p1 The name of the passed parameter. (shortterm for first parameter)
 */
function validateStartAt(startAt, endAt, fName, p1) {    
  GofBasicValidation.validateNumber(startAt, { fName, p1 });
  GofBasicValidation.isLowerThan(startAt, 1, { fName, p1, p2: "1" });
  GofBasicValidation.hasDecimalPlaces(startAt, { fName, p1 });
  GofBasicValidation.isHigherThan(startAt, endAt, { fName, p1, p2: "endAt" });
}

/**
 * 
 * @param {number} endAt The number of the entry to end at.
 * @param {string} fName The name of the executed function.
 * @param {string} p1 The name of the passed parameter. (shortterm for first parameter)
 */
function validateEndAt(endAt, fName, p1) {
  GofBasicValidation.validateNumber(endAt, { fName, p1 });
  GofBasicValidation.hasDecimalPlaces(endAt, { fName, p1 });
}