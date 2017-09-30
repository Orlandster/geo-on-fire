import { GofBasicValidation } from "../validators/basic.validation";

/**
 * 
 * @param {string} type The event type to validate.
 * @param {string} fName The name of the executed function.
 */
export function validateEventTypeParameter(type, fName) {
  GofBasicValidation.validateString(type, { fName, p1: "type" });
  GofBasicValidation.validateEventType(type, { fName, p1: "type" });
}