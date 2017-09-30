import { GofCoordinatesValidation } from "../validators/coordinates.validation";

/**
 * 
 * @param {Object} center Location object which gets validated.
 * @param {string} fName The name of the executed function.
 */
export function validateCenterParameter(center, fName) {
  GofCoordinatesValidation.validateCoordinates(center, fName, "center");
}