import { GofBasicValidation } from "../validators/basic.validation";

/**
 * 
 * @param {string} pushKey The firebase push-key to validate.
 * @param {string} fName The name of the executed function.
 */
export function validatePushKeyParameter(pushKey, fName) {
  GofBasicValidation.validateString(pushKey, { fName, p1: "pushKey" });
  GofBasicValidation.containsSpecialChars(pushKey, { fName, p1: "pushKey" });
  GofBasicValidation.containsSpaces(pushKey, { fName, p1: "pushKey" });
}