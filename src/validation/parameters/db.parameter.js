import GofBasicValidation from "../validators/basic.validation";

/**
 * 
 * @param {Firebase} db - The Firebase database reference which gets validated.
 * @param {string} fName The name of the executed function.
 */
export default function validateDbParameter(db, fName) {
  GofBasicValidation.validateObject(db, { fName, p1: "firebase.database()" });
  GofBasicValidation.validateReference(db, { fName, p1: "firebase.database()" });
}