import GofCoordinatesValidation from "../validators/coordinates.validation";

/**
 * 
 * @param {Object} entry The entry to validate.
 * @param {string} fName The name of the executed function.
 * @param {string} parameter The name of the entry parameter.
 */
export default function validateEntryParameter(entry, fName, parameter) {
  GofCoordinatesValidation.validateCoordinates(entry.location, fName, parameter);
}