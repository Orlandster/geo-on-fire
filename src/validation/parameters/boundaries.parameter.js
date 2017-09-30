import { GofCoordinatesValidation } from "../validators/coordinates.validation";
import { GofBasicValidation } from "../validators/basic.validation";

/**
 * 
 * @param {Object} boundaries Boundaries object whichgets validated.
 * @param {string} fName The name of the executed function.
 * @param {string} parameter The name of the boundaries parameter.
 */
export function validateBoundariesParameter(boundaries, fName, parameter) {
  GofCoordinatesValidation.validateCoordinates(boundaries.sw, fName, `${parameter}.sw`);
  GofCoordinatesValidation.validateCoordinates(boundaries.ne, fName, `${parameter}.ne`);

  GofBasicValidation.isHigherThan(
    boundaries.sw.lat, 
    boundaries.ne.lat, 
    { fName, p1: "boundaries.sw.lat", p2: "boundaries.ne.lat" }
  );  
  
  GofBasicValidation.isHigherThan(
    boundaries.sw.lng, 
    boundaries.ne.lng, 
    { fName, p1: "boundaries.sw.lng", p2: "boundaries.ne.lng" }
  );
}