import { GofUtils } from "./gof-utils";

/** 
 * geo on fire database class
 */
export class GofDb {
  /**
   * 
   * @param {string} name Name for the Gof query.
   * @param {Firebase} db The Firebase database reference - database().ref().
   */
  constructor(name, db) {
    const validName = name.replace(" ", "-").toLowerCase();

    this._refs = {
      entries: db.child(`${validName}`),
      geohashes: db.child(`${validName}-geo`),
    }

    // pass reference for the utils
    this._utils = GofUtils;
  }

  /**
   * Pushes a new entry to the database.
   *
   * @param {Object} entry The new entry object.
   * @return {Promise.<Object>} A promise which is fulfilled once the entry was created.
   */
  pushEntry(entry) {
    return this._refs.entries.push(entry);
  }

  /**
   * Gets the Geohash based on the locations coordinates.
   *
   * @param {string} pushKey The firebase push-key of the entry.
   * @param {Object} entry The entry to create.
   * @param {Array.<string>} geohashes The geohashes which the entry belongs to.
   * @return {Promise} A promise which is fulfilled once all the locations are set.
   */
  setGeohashLocations(pushKey, entry, geohashes) {        
    return Promise.all(this.getLocationNodesToAdd(pushKey, entry, geohashes));
  }
    
  /**
   * Fetchs all the entries based on the provided entry push keys
   *
   * @param {Array.<string>} pushKeys The push-keys of all the provided locations.
   * @param {number} startAt The entry to start at.
   * @param {number} endAt The etnry to end at.
   * @return {Promise.<Object>} A promise which is fulfilled once the locations are fetched.
   */
  fetchLocations(pushKeys, startAt, endAt) {
    const fetchedDataPromises = [];

    if (endAt) {
      // if endat is bigger than the number of entries limitate it to the last entry,
      const endAtLimitation = endAt > pushKeys.length ? pushKeys.length : endAt;

      for (let i = startAt - 1; i < endAtLimitation; i++) {
        fetchedDataPromises.push(
          this._refs.entries.child(`${pushKeys[i]}`).once("value")
        );
      }
    } else {
      for (let i = startAt - 1; i < (pushKeys.length - (startAt - 1)); i++) {
        fetchedDataPromises.push(
          this._refs.entries.child(`${pushKeys[i]}`).once("value")
        );
      }
    }

    return Promise.all(fetchedDataPromises);
  }

  /**
   * Returns all the locations based on the given geohashes.
   *
   * @param {Array.<string>} geohashes The given geohashes.
   * @return {Promise.<Object>} A promise which is fulfilled once the locations return.
   */
  getLocationsFromGeohashes(geohashes) {
    const locations = [];

    for (let i = 0; i < geohashes.length; i++) {
      locations.push(
        this._refs.geohashes.child(`${geohashes[i]}`).once("value")
      );
    }

    return Promise.all(locations)
      .catch(() => {
        throw new Error("Unable to get the entries.");
      });
  }

  /**
   * Updates all the entry and the accroding locations based on the new value.
   * It also removes old and adds new locations, 
   * based on the difference between the old and new geohashes.
   * This guarantees that the right event listeners will be triggered.
   * 
   *
   * @param {string} pushKey The firebase push-key of the entry
   * @param {Object} newValue The value of the new entry
   * @param {number} priority The priority of the entry.
   * @return {Promise} A promise which is fulfilled once the entry and the locations are updated.
   */
  updateEntry(pushKey, newValue, priority) {
    const newValueWithPrecisions = this._utils.setPrecisionsForEntry(priority, newValue);
    const newGeohash = this._utils.getGeohashByLocation(newValue.location, 
      newValueWithPrecisions.maxPrecision);
    const newGeohashPrecisions = this._utils.getGeohashPrecisions(newGeohash, 
      newValueWithPrecisions.minPrecision, newValueWithPrecisions.maxPrecision);

    return this._refs.entries.child(`${pushKey}`).once("value")
      .then(entry => {
        const entryValue = entry.val();
        const currentGeohash = this._utils.getGeohashByLocation(entryValue.location, 
          entryValue.maxPrecision);
        const currentGeohashPrecisions = this._utils.getGeohashPrecisions(currentGeohash, 
          entryValue.minPrecision, entryValue.maxPrecision);

        // if location changed update also the location nodes
        const promiseQueue = [];
        const geohashesByAction = this._utils.getGeohashActions(
          currentGeohashPrecisions, newGeohashPrecisions
        );

        // add nodes to add in queue
        promiseQueue.concat(this.getLocationNodesToAdd(
          pushKey, newValue.location, geohashesByAction.add)
        );
          
        // add nodes to update in queue - gets executed even if location is the same as bevor
        promiseQueue.concat(this.getLocationNodesToUpdate(
          pushKey, newValue.location, geohashesByAction.update)
        );

        // add nodes to delete in queue
        promiseQueue.concat(this.getLocationNodesToDelete(pushKey, geohashesByAction.delete));

        // finally also update the entry itslef
        promiseQueue.push(this._refs.entries.child(`${pushKey}`).update(newValue));

        return Promise.all(promiseQueue);
      })
      .catch(() => {
        throw new Error(`
          Unable to update the entry, Make sure the entry with "${pushKey}" exists
        `);
      });
  }

  /**
   * Deletes an existing entry and all the according locations.
   *
   * @param {string} pushKey The firebase push-key of the entry.
   * @return {Promise} A promise which is fulfilled once the entry and the locations are deleted.
   */
  deleteEntry(pushKey) {
    return this._refs.entries.child(`${pushKey}`).once("value")
      .then(entry => {
        const entryValue = entry.val();
        const geohash = this._utils.getGeohashByLocation(entryValue.location, 
          entryValue.maxPrecision);
        const geohashPrecisions = this._utils.getGeohashPrecisions(geohash, 
          entryValue.minPrecision, entryValue.maxPrecision);
        const deleteQueue = this.getLocationNodesToDelete(entry.key, geohashPrecisions);
            
        // adds the entry itself to the delete queue

        deleteQueue.push(this._refs.entries.child(`${entry.key}`).remove());

        return Promise.all(deleteQueue);
      })
      .catch(() => {
        throw new Error(`
          Unable to delete the entry, Make sure the entry with "${pushKey}" exists
        `);
      });
  }


  /**
   * Returns all the nodes to add based on the entries geohashes.
   *
   * @param {string} pushKey The firebase push-key of the entry.
   * @param {Object} value The value of the location.
   * @param {Array.<string>} geohashes The geohash precisions which the entry belongs to.
   * @return {Array.<Promise>} An array of promises, gets fullifilled once the location gets added.
   */
  getLocationNodesToAdd(pushKey, value, geohashes) {
    const addQueue = [];

    // adding all the existing locations to the add queue
    for (let i = 0; geohashes.length > i; i++) {
      addQueue.push(this._refs.geohashes.child(`${geohashes[i]}/${pushKey}`).set(value));
    }

    return addQueue;
  }

  /**
   * Returns all the nodes to update based on the entries geohashes.
   *
   * @param {string} pushKey The firebase push-key of the entry.
   * @param {Object} newValue The new value of the location.
   * @param {Array.<string>} geohashes The geohash precisions which the entry belongs to.
   * @return {Array.<Promise>} An array of promises, gets fullifilled once the location gets added.
   */
  getLocationNodesToUpdate(pushKey, newValue, geohashes) {
    const updateQueue = [];

    // adding all the existing locations to the update queue
    for (let i = 0; geohashes.length > i; i++) {
      updateQueue
        .push(this._refs.geohashes.child(`${geohashes[i]}/${pushKey}`).update(newValue));
    }

    return updateQueue;
  }
  
  /**
   * Returns all the nodes to delete based on the entries geohashes.
   *
   * @param {string} pushKey The firebase push-key of the entry.
   * @param {Array.<string>} geohashes The geohash precisions which the entry belongs to.
   * @return {Array.<Promise>} An array of promises, gets fullifilled once the location gets added.
   */
  getLocationNodesToDelete(pushKey, geohashes) {
    const deleteQueue = [];

    // adding all the existing locations to the delete queue
    for (let i = 0; geohashes.length > i; i++) {
      deleteQueue
        .push(this._refs.geohashes.child(`${geohashes[i]}/${pushKey}`).remove());
    }

    return deleteQueue;
  }
}