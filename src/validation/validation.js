import validateDbParameter from "./parameters/db.parameter";
import validateCenterParameter from "./parameters/center.parameter";
import validateRadiusParameter from "./parameters/radius.parameter";
import validateEntryLimitationParameters from "./parameters/entry-limitation.parameters";
import validateBoundariesParameter from "./parameters/boundaries.parameter";
import validateEntryParameter from "./parameters/entry.parameter";
import validatePriorityParameter from "./parameters/priority.parameter";
import validateMaxPrecisionParameter from "./parameters/max-precision.parameter";
import validateNameParameter from "./parameters/name.parameter";
import validatePushKeyParameter from "./parameters/push-key.parameter";
import validateNewValueParameter from "./parameters/new-value.parameter";
import validateEventTypeParameter from "./parameters/event-type.parameter";

/** 
 * geo on fire validation
 */
export default class GofValidation {
  /**
   * Validates the parameters of the Gof class constructor.
   *
   * @param {string} name - name for the Gof query
   * @param {Firebase} db - The Firebase database reference - database().ref()
   * @param {string} fName The name of the executed function.
   */
  static validateConstructor(name, db, fName) {
    validateNameParameter(name, fName);
    validateDbParameter(db, fName);
  }

  /**
   * Validates the parameters of the getLocationsByRadius Gof class member function.
   *
   * @param {Object} center Location object which represents the center of the given radius.
   * @param {number} radius The query radius in kilometers.
   * @param {number} startAt The entry to start at.
   * @param {number} endAt The etnry to end at.
   * @param {string} fName The name of the executed function.
   */
  static validateLocationsByRadius(center, radius, startAt, endAt, fName) {
    validateCenterParameter(center, fName);
    validateRadiusParameter(radius, fName);
    validateEntryLimitationParameters(startAt, endAt, fName);
  }

  /**
   * Validates the parameters of the getLocationsByBoundaries Gof class member function.
   *
   * @param {Object} boundaries Boundaries object which builds the rectangle query borders.
   * @param {number} startAt The entry to start at.
   * @param {number} endAt The etnry to end at.
   * @param {string} fName The name of the executed function.
   */
  static validateLocationsByBoundaries(boundaries, startAt, endAt, fName) {
    validateBoundariesParameter(boundaries, fName, "boundaries");
    validateEntryLimitationParameters(startAt, endAt, fName);
  }

  /**
   * Validates the parameters of the createEntry Gof class member function.
   *
   * @param {Object} entry The new entry to create.
   * @param {number} priority The priority of the new entry.
   * @param {number} maxPrecision The maximum geohash precision.
   * @param {string} fName The name of the executed function.
   */
  static validateCreateEntry(entry, priority, maxPrecision, fName) {
    validateEntryParameter(entry, fName, "entry.location");
    validatePriorityParameter(priority, fName);
    validateMaxPrecisionParameter(maxPrecision, fName);
  }

  /**
   * Validates the parameters of the updateEntryLocation Gof class member function.
   *
   * @param {string} pushKey The firebase push-key of the entry to update.
   * @param {Object} newValue The new value of the entry to update.
   * @param {number} priority The priority of the entry to update.
   * @param {string} fName The name of the executed function.
   */
  static validateUpdateEntryLocation(pushKey, newValue, priority, fName) {
    validatePushKeyParameter(pushKey, fName);
    validateNewValueParameter(newValue, fName, "newValue.location");
    validatePriorityParameter(priority, fName);
  }

  /**
   * Validates the parameters of the deleteEntryLocation Gof class member function.
   *
   * @param {string} pushKey The firebase push-key of the entry to delete.
   * @param {string} fName The name of the executed function.
   */
  static validateDeleteEntry(pushKey, fName) {
    validatePushKeyParameter(pushKey, fName);
  }

  /**
   * Validates the parameters of the .on() event listener.
   *
   * @param {string} type The event type: "value", "child_added", "child_changed", "child_removed".
   * @param {string} fName The name of the executed function.
   */
  static validateOn(type, fName) {
    validateEventTypeParameter(type, fName);
  }
}