import { GofUtils } from "./gof-utils";
import { GofDb } from "./gof-db";
import { GofValidation } from "./validation/validation";
import { GofDbListeners } from "./gof-db-listeners";

/** 
 * geo on fire entry point 
 */
export default class Gof {
  /**
   * 
   * @param {string} name - Name for the Gof query.
   * @param {Firebase} db - The Firebase database reference - database().ref()
   */
  constructor(name, db) {
    GofValidation.validateConstructor(name, db, "geoOnFire()");
    this._utils = GofUtils;
    this._db = new GofDb(name, db);
    this.registerEvents();

    // holds the current query infos
    this._activeQuery = {
      geohashes: [],
      entries: [],
      parameters: [],
      dbListeners: [],
    }
  }

  /**
   * Sets the active query object with all locations from a given radius(km).
   * The reulst can be limited with startAt and endAt. e.g. 1 - 50
   * 
   * Needs to be called in a function chain with .on() or .once()
   *
   * @param {Object} center Location object which represents the center of the given radius.
   * @param {number} radius The query radius in kilometers.
   * @param {number} [startAt=1] The entry to start at - e.g. start for pagination.
   * @param {number} [endAt=undefined] The etnry to end at. Default returns all.
   * @return {function} The function itself to make .on() and .once() chains possible.
   */
  getLocationsByRadius(center, radius, startAt = 1, endAt = undefined) {
    GofValidation.validateLocationsByRadius(
      center, radius, startAt, endAt, "getLocationsByRadius()"
    );

    this._activeQuery.parameters = { center, radius, startAt, endAt }

    const boundaries = this._utils.getBoundariesFromRadius(center, radius);
    const precision = this._utils.caluclatePrecisionFromBoundaries(boundaries);
    this._activeQuery.geohashes = this._utils.getGeohashesInBoundaries(boundaries, precision);

    this._activeQuery.entries = this._db.getLocationsFromGeohashes(this._activeQuery.geohashes)
      .then(geohashNode => this._utils.getLocationsInRadius(geohashNode, center, radius))
      .then(pushKeys => this._db.fetchLocations(pushKeys, startAt,  endAt));

    return this.getLocationsByRadius;
  } 

  /**
   * Sets the active query object with all locations from given boundaries(south-west / north-east).
   * The reulst can be limited with startAt and endAt. e.g. 1 - 50
   * 
   * Needs to be called in a function chain with .on() or .once()
   * 
   * @param {Object} boundaries Boundaries object which builds the rectangle query borders.
   * @param {number} [startAt=1] The entry to start at - e.g. start for pagination.
   * @param {number} [endAt=undefined] The etnry to end at. Default returns all.
   * @return {function} The function itself to make .on() and .once() chains possible.
   */
  getLocationsByBoundaries(boundaries, startAt = 1, endAt = undefined) {
    GofValidation.validateLocationsByBoundaries(
      boundaries, startAt, endAt, "getLocationsByBoundaries()"
    );

    this._activeQuery.parameters = { boundaries, startAt, endAt }
    const precision = this._utils.caluclatePrecisionFromBoundaries(boundaries);
    this._activeQuery.geohashes = this._utils.getGeohashesInBoundaries(boundaries, precision);

    this._activeQuery.entries = this._db.getLocationsFromGeohashes(this._activeQuery.geohashes)
      .then(geohashNodes => this._utils.getLocationsInBoundaries(geohashNodes, boundaries))
      .then(pushKeys => this._db.fetchLocations(pushKeys, startAt,  endAt));

    return this.getLocationsByBoundaries;
  }

  /**
   * Creates a new entry in the database and sets all the according locations. (geohashes)
   * priority and maxPrecison are the geohash lengths. e.g. (prio of 4 == abcd).
   * 
   * Low priority (1-4) can slow up the speed on apps with massive scaling.
   *
   * @param {Object} entry The new entry to create.
   * @param {number} [priority=5] The priority of the new entry. (1 = high prio, 5 = low prio)
   * @param {number} [maxPrecision=9] The maximum geohash precision. (7 - 9)
   * @return {Promise.<Object>} A promise which is fulfilled once the entry was created.
   */
  createEntry(entry, priority = 5, maxPrecision = 9) {
    GofValidation.validateCreateEntry(entry, priority, maxPrecision, "createEntry()");
    const geohash = this._utils.getGeohashByLocation(entry.location, maxPrecision);
    const geohashPrecisions = this._utils.getGeohashPrecisions(geohash, priority, maxPrecision);
    const entryWithPrecisions = this._utils.setPrecisionsForEntry(priority, entry);

    return this._db.pushEntry(entryWithPrecisions)
      .then(data => this._db.setGeohashLocations(data.key, entry.location, geohashPrecisions));
  }

  /**
   * Updates an existing entry in the database and all the according locations. (geohashes)
   * The priority represents the geohash length. e.g. (prio of 4 == abcd).
   * 
   * Low priority (1-4) can slow up the speed on apps with massive scaling.
   *
   * @param {string} pushKey The firebase push-key of the entry to update.
   * @param {Object} newValue The new value of the entry to update.
   * @param {number} [priority=5] The priority of the entry to update. (1 = high prio, 5 = low prio)
   * @return {Promise.<Object>} A promise which is fulfilled once the entry was updated.
   */
  updateEntryLocation(pushKey, newValue, priority = 5) {
    GofValidation.validateUpdateEntryLocation(pushKey, newValue, priority, "updateEntryLocation()");
    return this._db.updateEntry(pushKey, newValue, priority);
  }

  /**
   * Deletes an existing entry in the database and all the according locations. (geohashes)
   *
   * @param {string} pushKey The firebase push-key of the entry to delete.
   * @return {Promise.<Object>} A promise which is fulfilled once the entry was deleted.
   */
  deleteEntry(pushKey) {
    GofValidation.validateDeleteEntry(pushKey, "deleteEntry()");
    return this._db.deleteEntry(pushKey);
  }

  /**
   * Registers the on() and once() listeners on the query functions
   */
  registerEvents() {
    /**
     * Event listeners for getLocationsByBoundaries. Returns the query result based on events.
     *
     * @param {string} type The event type.
     * @return {Promise.<Object>} A promise which is fulfilled each time the event fires. 
     * Be aware the promise was modified and is able to stream data, similair to a callback.
     */
    this.getLocationsByBoundaries.on = (type) => this.attachBoundsEvent(type);


    /**
     * Event listeners for getLocationsByRadius. Returns the query result based on events.
     *
     * @param {string} type The event type.
     * @return {Promise.<Object>} A promise which is fulfilled each time the event fires. 
     * Be aware the promise was modified and is able to stream data, similair to a callback.
     */
    this.getLocationsByRadius.on = (type) => this.attachRadiusEvent(type);

    /**
     * Returns the query result for getLocationsByBoundaries once.
     *
     * @return {Promise.<Object>} A promise which is fulfilled once the query completed. 
     */
    this.getLocationsByBoundaries.once = () => this._activeQuery.entries;

    /**
     * Returns the query result for getLocationsByRadius once.
     *
     * @return {Promise.<Object>} A promise which is fulfilled once the query completed. 
     */
    this.getLocationsByRadius.once = () => this._activeQuery.entries;
  }

  /**
   * Attaches the event listener and returns the streamable promise.
   *
   * @param {string} type The event type: "value", "child_added", "child_changed", "child_removed".
   * @return {Promise.<Object>} A promise which is fulfilled each time the event fires. 
   * Be aware the promise was modified and is able to stream data, similair to a callback.
   */
  attachBoundsEvent(type) {
    GofValidation.validateOn(type, "on()");
    const event = new Event("bounds");
    const callbackList = [];
    const streamingPromise = {
      then: (fn) => {
        callbackList.push(fn);
        window.dispatchEvent(event);
      },
    };
    
    // attach the firebase db listeners to the event listener
    this._activeQuery.dbListeners = GofDbListeners.attachDbListeners(
        type, this._db._refs, this._activeQuery.geohashes, event
      );

    // add the event listener
    window.addEventListener("bounds", () => {
      for (const cb of callbackList) {
        this.getLocationsByBoundaries(this._activeQuery.parameters.boundaries, 
          this._activeQuery.parameters.startAt, this._activeQuery.parameters.endAt);

        // unwrap the values to make return value similair to .once()
        this._activeQuery.entries.then(entries => cb(entries));
      }
    });

    return streamingPromise;
  }

  /**
   * Attaches the event listener and returns the streamable promise.
   *
   * @param {string} type The event type: "value", "child_added", "child_changed", "child_removed"
   * @return {Promise.<Object>} A promise which is fulfilled each time the event fires. 
   * Be aware the promise was modified and is able to stream data, similair to a callback.
   */
  attachRadiusEvent(type) {
    GofValidation.validateOn(type, "on()");
    const event = new Event("radius");
    const callbackList = [];
    const streamingPromise = {
      then: (fn) => {
        callbackList.push(fn);
        window.dispatchEvent(event);
      },
    };
    
    // attach the firebase db listeners to the event listener
    this._activeQuery.dbListeners = GofDbListeners.attachDbListeners(
      type, this._db._refs, this._activeQuery.geohashes, event
    );

    // add the event listener
    window.addEventListener("radius", () => {
      for (const cb of callbackList) {
        this.getLocationsByRadius(
          this._activeQuery.parameters.center, this._activeQuery.parameters.radius,
          this._activeQuery.parameters.startAt, this._activeQuery.parameters.endAt
        );

        // unwrap the values to make return value similair to .once()
        this._activeQuery.entries.then(entries => cb(entries));
      }
    });

    return streamingPromise;
  }

  /**
   * Destroys the existing query and all of its event listeners.
   */
  destroy() {
    if (this._activeQuery.dbListeners.length) {
      this._activeQuery.dbListeners.forEach(listener => {
        listener.off();
      });
      this._activeQuery.dbListeners = [];
    }
  }
}