import { GofBasicValidation } from "../validators/basic.validation";

/**
 * 
 * @param {string} name - Name to validate.
 * @param {string} fName The name of the executed function.
 */
export function validateNameParameter(name, fName) {
  GofBasicValidation.validateString(name, { fName, p1: "name" });
  GofBasicValidation.containsSpecialChars(name, { fName, p1: "name" });
}