import { GofBasicValidation } from "../validators/basic.validation"

/**
 * 
 * @param {number} priority The priority to validate.
 * @param {string} fName The name of the executed function.
 */
export function validatePriorityParameter(priority, fName) {
  GofBasicValidation.validateNumber(priority, { fName, p1: "priority" });
  GofBasicValidation.hasDecimalPlaces(priority, { fName, p1: "priority" });
  GofBasicValidation.isLowerThan(priority, 1, { fName, p1: "priority", p2: "1" });
  GofBasicValidation.isHigherThan(priority, 5, { fName, p1: "priority", p2: "5" });
}