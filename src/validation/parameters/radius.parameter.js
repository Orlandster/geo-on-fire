import GofBasicValidation from "../validators/basic.validation";

/**
 * 
 * @param {number} radius The query radius to validate.
 * @param {string} fName The name of the executed function.
 */
export default function validateRadiusParameter(radius, fName) {
  GofBasicValidation.validateNumber(radius, { fName, p1: "radius" });
  GofBasicValidation.isLowerThan(radius, 0, { fName, p1: "radius", p2: "0" });
}