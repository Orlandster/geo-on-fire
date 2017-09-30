import { GofBasicValidation } from "../validators/basic.validation";

/**
 * 
 * @param {number} maxPrecision The maximum geohash precision to validate.
 * @param {string} fName The name of the executed function.
 */
export function validateMaxPrecisionParameter(maxPrecision, fName) {
  GofBasicValidation.validateNumber(maxPrecision, { fName, p1: "maxPrecision" });
  GofBasicValidation.hasDecimalPlaces(maxPrecision, { fName, p1: "maxPrecision" });
  GofBasicValidation.isLowerThan(maxPrecision, 7, { fName, p1: "maxPrecision", p2: "7" });
  GofBasicValidation.isHigherThan(maxPrecision, 9, { fName, p1: "maxPrecision", p2: "9" });
}