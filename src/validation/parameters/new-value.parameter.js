import { validateEntryParameter } from "./entry.parameter";
import { validatePriorityParameter } from "./priority.parameter";
import { validateMaxPrecisionParameter } from "./max-precision.parameter";

/**
 * 
 * @param {Object} newValue The new entry value to validate.
 * @param {string} fName The name of the executed function.
 * @param {string} parameter The name of the new value parameter.
 */
export function validateNewValueParameter(newValue, fName, parameter) {
  validateEntryParameter(newValue, fName, "newValue.location");
  validatePriorityParameter(newValue.minPrecision, fName);
  validateMaxPrecisionParameter(newValue.maxPrecision, fName);
}