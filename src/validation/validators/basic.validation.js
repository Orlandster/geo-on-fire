/** 
 * geo on fire basic validation
 */
export class GofBasicValidation {

  constructor() {}

  /**
   * Checks if a given value is a valid number.
   *
   * @param {*} value The value to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateNumber(value, errorInfos) {
    if (typeof value !== "number") {
      this.throwError(errorInfos.fName, `${errorInfos.p1} must be of type number!`);
    } else if (isNaN(value)) {
      this.throwError(errorInfos.fName, `${errorInfos.p1} should not contain the value NaN!`);
    }
  }

  /**
   * Checks if a given value is a valid string.
   *
   * @param {*} value The value to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateString(value, errorInfos) {
    if (typeof value !== "string") {
      this.throwError(errorInfos.fName, `${errorInfos.p1} must be of type string!`);
    }
  }

  /**
   * Checks if a given value is a valid function.
   *
   * @param {*} value The value to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateFunction(value, errorInfos) {
    if (typeof value !== "function") {
      this.throwError(errorInfos.fName, `${errorInfos.p1} must be of type function!`);
    }
  }

  /**
   * Checks if a given value is a valid object.
   *
   * @param {*} value The value to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateObject(value, errorInfos) {
    if (typeof value !== "object") {
      this.throwError(errorInfos.fName, `${errorInfos.p1} must be of type object!`);
    }
  }

  /**
   * Checks if a given string contains special characters.
   * In this case "-", " " and "_" are allowed.
   *
   * @param {string} string The string to check for containing special chars.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static containsSpecialChars(string, errorInfos) {
    if (string.match(/[^A-Za-z0-9\-_ ]/)) {
      this.throwError(errorInfos.fName, `${errorInfos.p1} should not contain special chars!`);
    }
  }

  /**
   * Checks if a given string contains spaces.
   *
   * @param {string} string The string to check for containing spaces.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static containsSpaces(string, errorInfos) {
    if (/\s/.test(string)) {
      this.throwError(errorInfos.fName, `${errorInfos.p1} should not contain white spaces!`);
    }
  }

  /**
   * Checks if a given value is a valid firebase reference
   * It simply checks if the .child() function exists on the provided value.
   *
   * @param {*} value The value to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateReference(value, errorInfos) {
    if (typeof value.child !== "function") {
      this.throwError(
        errorInfos.fName, `${errorInfos.p1} is not a valid firebase database reference!`
      );
    }
  }

  /**
   * Checks if a given event type is a valid.
   * Allowed are "value", "child_added", "child_changed", "child_removed".
   *
   * @param {string} type The event type to validate.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static validateEventType(type, errorInfos) {
    if (type === "child_moved") {
      this.throwError(
        errorInfos.fName, `${errorInfos.p1} of "child_moved" is not supported.`
        + ` You have to use one of the follwoing types: `
        +  `"value", "child_added", "child_changed", "child_removed"` // breaks for linting
      );
    } else if (type !== "value" 
               && type !== "child_added" 
               && type !== "child_changed" 
               && type !== "child_removed") { // eslint rule sry
      this.throwError(
        errorInfos.fName, `"${type}" is not a valid ${errorInfos.p1}.`
        + ` You have to use one of the follwoing types: `
        +  `"value", "child_added", "child_changed", "child_removed"` // breaks for linting
      );
    }
  }

  /**
   * Checks if the first provided number is lower than the second provided number.
   *
   * @param {number} firstNumber The first number to compare.
   * @param {number} secondNumber The second number to compare.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static isLowerThan(firstNumber, secondNumber, errorInfos) {
    if (firstNumber < secondNumber) {
      this.throwError(
        errorInfos.fName, `${errorInfos.p1} must be higher or same as ${errorInfos.p2}!`
      );
    }
  }

  /**
   * Checks if the first provided number is higher than the second provided number.
   *
   * @param {number} firstNumber The first number to compare.
   * @param {number} secondNumber The second number to compare.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static isHigherThan(firstNumber, secondNumber, errorInfos) {
    if (firstNumber > secondNumber) {
      this.throwError(
        errorInfos.fName, `${errorInfos.p1} must be lower or same as ${errorInfos.p2}!`
      );
    }
  }

  /**
   * Checks if a given number contains decimal places.
   *
   * @param {number} number The number to check for decimal places.
   * @param {Object} errorInfos A object containing the important error info's e.g. function name.
   */
  static hasDecimalPlaces(number, errorInfos) {
    if (number % 1 !== 0) {
      this.throwError(errorInfos.fName, `${errorInfos.p1} should not contain decimal places!`);
    }
  }

  /**
   * Throws an error based on the executed function and the failed validation.
   *
   * @param {string} fName The name of the executed function.
   * @param {string} error The error message to throw.
   */
  static throwError(fName, error) {
    throw new Error(`${fName} - ${error}`);
  }
}