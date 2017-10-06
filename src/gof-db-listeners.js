/** 
 * geo on fire database listeners class
 */
export default class GofDbListeners {
  /**
   * Attaches the database listeners based on the event type.
   * The firebase event "child_moved" gets not supported.
   *
   * @param {string} type The event type: "value", "child_added", "child_changed", "child_removed".
   * @param {Object} dbRef The dbRef object containing the entries and locations path.
   * @param {Array.<string>} geohashes The geohashes based on the active query.
   * @param {Object} event The query event object.
   * @return {Array.<Object>} An array containing the listeners reference.
   */
  static attachDbListeners(type, dbRef, geohashes, event) {
    let listeners = [];

    if (type === "value") {
      listeners = this.onValue(dbRef, geohashes, event);
    } else if (type === "child_added") {
      listeners = this.onChildAdded(dbRef, geohashes, event);
    } else if (type === "child_changed") {
      listeners = this.onChildChanged(dbRef, geohashes, event);
    } else if (type === "child_removed") {
      listeners = this.onChildRemoved(dbRef, geohashes, event);
    }

    return listeners;
  }

  /**
   * Fires the geo query event based on firebase's "value" event.
   * Returns an array with all the listeners. (needed to use .off() later on)
   *
   * @param {Object} dbRef The dbRef object containing the entries and locations path.
   * @param {Array.<string>} geohashes The geohashes based on the active query.
   * @param {Object} event The query event object.
   * @return {Array.<Object>} An array containing the reference of all "value" listeners.
   */
  static onValue(dbRef, geohashes, event) {
    const listeners = [];

    geohashes.forEach((geohash) => {
      dbRef.geohashes.child(geohash).on("value", (data) => {
        window.dispatchEvent(event);
      });

      const ref = dbRef.geohashes.child(geohash);
      listeners.push(ref);
    });

    return listeners;
  }

  /**
   * Fires the geo query event based on firebase's "child_added" event.
   * Returns an array with all the listeners. (needed to use .off() later on)
   *
   * @param {Object} dbRef The dbRef object containing the entries and locations path.
   * @param {Array.<string>} geohashes The geohashes based on the active query.
   * @param {Object} event The query event object.
   * @return {Array.<Object>} An array containing the reference of all "value" listeners.
   */
  static onChildAdded(dbRef, geohashes, event) {
    const listeners = [];
      
    geohashes.forEach((geohash) => {
      dbRef.geohashes.child(geohash).on("child_added", (data) => {
        window.dispatchEvent(event);
      })

      const ref = dbRef.geohashes.child(geohash);
      listeners.push(ref);
    });

    return listeners;
  }

  /**
   * Fires the geo query event based on firebase's "child_changed" event.
   * Returns an array with all the listeners. (needed to use .off() later on)
   *
   * @param {Object} dbRef The dbRef object containing the entries and locations path.
   * @param {Array.<string>} geohashes The geohashes based on the active query.
   * @param {Object} event The query event object.
   * @return {Array.<Object>} An array containing the reference of all "value" listeners.
   */
  static onChildChanged(dbRef, geohashes, event) {
    const listeners = []; 

    geohashes.forEach((geohash) => {
      dbRef.geohashes.child(geohash).on("child_changed", (data) => {
        window.dispatchEvent(event);
      });

      const ref = dbRef.geohashes.child(geohash);
      listeners.push(ref);
    });
      
    return listeners;
  }

  /**
   * Fires the geo query event based on firebase's "child_removed" event.
   * Returns an array with all the listeners. (needed to use .off() later on)
   *
   * @param {Object} dbRef The dbRef object containing the entries and locations path.
   * @param {Array.<string>} geohashes The geohashes based on the active query.
   * @param {Object} event The query event object.
   * @return {Array.<Object>} An array containing the reference of all "value" listeners.
   */
  static onChildRemoved(dbRef, geohashes, event) {
    const listeners = []; 
      
    geohashes.forEach((geohash) => {
      dbRef.geohashes.child(geohash).on("child_removed", (data) => {
        window.dispatchEvent(event);
      });

      const ref = dbRef.geohashes.child(geohash);
      listeners.push(ref);
    });
      
    return listeners;  
  }
}