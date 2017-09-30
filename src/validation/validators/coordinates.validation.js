import { GofBasicValidation } from "./basic.validation";

/** 
 * geo on fire coordinates validation
 */
export class GofCoordinatesValidation {

  constructor() {}

  /**
   * Validates the coordinates latitude/longitude pair.
   *
   * @param {Object} coordinates The coordinates lat/lng pair to validate.
   * @param {string} fName The name of the executed function.
   * @param {string} parameter The name of the passed parameter.
   */
  static validateCoordinates(coordinates, fName, parameter) {
    this.validateLat(coordinates.lat, fName, `${parameter}.lat`);
    this.validateLng(coordinates.lng, fName, `${parameter}.lng`);
  }

  /**
   * Validates the geographic latitude of a given coordinate.
   *
   * @param {number} lat The latitude to validate.
   * @param {string} fName The name of the executed function.
   * @param {string} p1 The name of the passed parameter. (shortterm for first parameter)
   */
  static validateLat(lat, fName, p1) {
    GofBasicValidation.validateNumber(lat, { fName, p1 });
    GofBasicValidation.isHigherThan(lat, 90, { fName, p1, p2: 90 });
    GofBasicValidation.isLowerThan(lat, -90, { fName, p1, p2: -90 });
  }

  /**
   * Validates the geographic longitude of a given coordinate.
   *
   * @param {number} lng The longitude to validate.
   * @param {string} fName The name of the executed function.
   * @param {string} p1 The name of the passed parameter. (shortterm for first parameter)
   */
  static validateLng(lng, fName, p1) {
    GofBasicValidation.validateNumber(lng, { fName, p1 });
    GofBasicValidation.isHigherThan(lng, 180, { fName, p1, p2: 180 });
    GofBasicValidation.isLowerThan(lng, -180, { fName, p1, p2: -180 });
  }
}