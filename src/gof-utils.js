import ngeohash from "ngeohash";

/** 
 * geo on fire utils
 */
export default class GofUtils {
  /**
   * Returns a geohash based on the provided location and the precision.
   * e.g. "abcdef" would be a precision of 6 (number of characters)
   *
   * @param {Object} location The location object with the coordinates. (lat/lng)
   * @param {string} precision The precision for the returning geohash.
   * @return {string} The calculated geohash string.
   */
  static getGeohashByLocation(location, precision) {
    return ngeohash.encode(location.lat, location.lng, precision);
  }

  /**
   * Returns the Geohash precisions based on the min and max precision.
   * e.g. min = 5 and max = 7 would return ["abcdefg", "abcdef", "abcde"]
   *
   * @param {string} geohash The geohash string with the maximum length.
   * @param {number} minPrecision The minimal precision for the geohash.
   * @param {number} maxPrecision The maximum precision for the geohash.
   * @return {Array.<string>} The geohash precisions.
   */
  static getGeohashPrecisions(geohash, minPrecision, maxPrecision) {
    const geohashes = [];

    for (let i = 0; maxPrecision - minPrecision >= i; i += 1) {
      geohashes.push(geohash.substring(0, geohash.length - i));
    }

    return geohashes;
  }

  /**
   * Sets the geohash precisions of an entry.
   *
   * @param {number} priority The priority of the new entry.
   * @param {Object} entry The entry object to set the precisions for.
   * @return {Object} The entry with the precisions set.
   */
  static setPrecisionsForEntry(priority, entry) {
    const entryWithPrecisions = entry;

    entryWithPrecisions.minPrecision = priority;
    entryWithPrecisions.maxPrecision = 9; // default precision should not be changed

    return entryWithPrecisions;
  }

  /**
   * Returns the geohash add, update and delete actions based on existing and new geohashes.
   * This function guarantes that the event listeners get triggered correctly.
   * 
   * e.g. currentGeohashes = ["a", "b", "c"] and newGeohashes = ["b", "c", "d"] would return
   * add: ["d"], update: ["b", "c"], delete: ["a"]
   * 
   * @param {Array.<string>} currentGeohashes The geohashes based on the current location.
   * @param {Array.<string>} newGeohashes The geohashes based on the new location.
   * @return {Object} An object containing the geohashes for the add, update and delete action.
   */
  static getGeohashActions(currentGeohashes, newGeohashes) {
    const geohashesByAction = {};

    geohashesByAction.add = newGeohashes.filter(x => currentGeohashes.indexOf(x) < 0);
    geohashesByAction.delete = currentGeohashes.filter(x => newGeohashes.indexOf(x) < 0);
    geohashesByAction.update = currentGeohashes.filter(
      x => geohashesByAction.add.concat(geohashesByAction.delete).indexOf(x) < 0,
    );

    return geohashesByAction;
  }

  /**
   * Returns all the visible Geohashes within the given Boundaries (also overlapping geohashes)
   * The geohash length will be calculated from the given precision.
   * 
   * This function works as a preselection for the entries 
   * and protects tons of them from running through an unnecessary query.
   *
   * @param {Object} boundaries The boundaries object which builds the rectangle query borders.
   * @param {number} precision The precision of the geohashes to return.
   * @return {Array.<string>} An array containing all the geohashes within the prvided boundaries.
   */
  static getGeohashesInBoundaries(boundaries, precision) {
    return ngeohash.bboxes(
      boundaries.sw.lat, 
      boundaries.sw.lng, 
      boundaries.ne.lat, 
      boundaries.ne.lng, precision,
    );
  }

  /**
   * Returns all the keys of locations which are inside the provided boundaries
   * This is the one and onliest query which will be executed for the boundary search.
   *
   * @param {Array.<Promise>} geohashNode The db nodes based on the geohashes within the boundaries.
   * @param {Object} boundaries The boundaries object which builds the rectangle query borders.
   * @return {Promise} A promise which gets fullifilled when all the locations are returned.
   */
  static getLocationsInBoundaries(geohashNode, boundaries) {
    const promises = [];

    geohashNode.map((locations) => {
      // check if locations node exists
      if (locations.val()) {
        locations.forEach((location) => {
          // check if single location is within boundaries
          if (this.isInBoundaries(location.val(), boundaries)) {
            promises.push(new Promise((resolve, reject) => {
              resolve(location.key);
            }));
          }
        });
      }

      return false;
    });

    return Promise.all(promises);
  }

  /**
   * Checks if the given location is within the boundaries.
   * This needs to be done, since there are also overalpping locations, 
   * which are outside of the boundaries.
   * 
   * @param {Object} location The the location to check.
   * @param {Object} boundaries The boundaries to compare with.
   * @return {boolean} Says if the location is in or outside of the provided boundaries
   */
  static isInBoundaries(location, boundaries) {
    let isInBoundaries = false;
    
    if (boundaries.sw.lat <= location.lat && boundaries.sw.lng <= location.lng 
        && boundaries.ne.lat >= location.lat && boundaries.ne.lng >= location.lng) {  
      isInBoundaries = true;
    }

    return isInBoundaries;
  }

  /**
   * Returns the boundaries from the provided radius based on the center's location.
   * Basically the function converts the circle(from radius)into a rectangle.
   * This brings a huge performance gain, since the values can get preselected.
   * 
   * @param {Object} center Location object which represents the center of the given radius.
   * @param {number} radius The query radius in kilometers.
   * @return {Object} The boundaries based on the given radius circle.
   */
  static getBoundariesFromRadius(center, radius) {
    // one degree in kilometers for latitude - without Earth's polar flattening
    const LatOneDeg = 110.54;
    
    // kilometeres
    const LngOneDeg = 111.320;
    const boundaries = { sw: {}, ne: {} };

    boundaries.sw.lat = center.lat - ((1 / LatOneDeg) * radius);
    boundaries.sw.lng = 
      center.lng - ((1 / (LngOneDeg * Math.cos(this.degreesToRadians(center.lat)))) * radius);
    boundaries.ne.lat = center.lat + ((1 / LatOneDeg) * radius)
    boundaries.ne.lng = 
      center.lng + ((1 / (LngOneDeg * Math.cos(this.degreesToRadians(center.lat)))) * radius);
    
    return boundaries;
  }

  /**
   * Returns all the keys of locations which are inside the provided radius
   * This is the one and onliest query which will be executed for the boundary search.
   *
   * @param {Array.<Promise>} geohashNode The db nodes based on the geohashes within the radius.
   * @param {Object} center Location object which represents the center of the given radius.
   * @param {number} radius The query radius in kilometers.
   * @return {Promise} A promise which gets fullifilled when all the locations are returned.
   */
  static getLocationsInRadius(geohashNode, center, radius) {
    const promises = [];

    geohashNode.map((locations) => {
      // check if locations node exists
      if (locations.val()) {
        locations.forEach((location) => {
          // check if single location is within radius
          if (this.isInRadius(location.val(), center, radius)) {
            promises.push(new Promise((resolve, reject) => {
              resolve(location.key);
            }));
          }
        });
      }

      return false;
    });

    return Promise.all(promises);
  }

  /**
   * Checks if the given location is within the provided radius.
   * This needs to be done, since there are also overalpping locations,
   * which our outside of the radius.
   * 
   * @param {Object} location The the location to check.
   * @param {Object} center Location object which represents the center of the given radius.
   * @param {number} radius The query radius in kilometers.
   * @return {boolean} Says if location is in or outside of the radius.
   */
  static isInRadius(location, center, radius) {
    let isInRadius = false;
    
    if (this.distBtwLocations(location, center) <= radius) {
      isInRadius = true;
    }

    return isInRadius;
  }

  /**
   * Calculates the distance between the provided location the given center.
   * 
   * @param {Object} location The the location to get the ditstance from.
   * @param {Object} center Location object which represents the center of the given radius.
   * @return {number} Says if location is in or outside of boundaries
   */
  static distBtwLocations(location, center) {
    const radlatCenter = (Math.PI * center.lat) / 180;
    const radlatLocation = (Math.PI * location.lat) / 180;
    const theta = center.lng - location.lng;
    const radtheta = (Math.PI * theta) / 180;
    let distance = (Math.sin(radlatCenter) * Math.sin(radlatLocation)) + 
      (Math.cos(radlatCenter) * Math.cos(radlatLocation) * Math.cos(radtheta));

    distance = Math.acos(distance);
    distance = (distance * 180) / Math.PI;
    distance = distance * 60 * 1.1515;
    distance *= 1.609344;

    return distance;
  }

  /**
   * Calculates the geohash precisions based on the distance between the boundaries.
   * to be optimized...
   * 
   * @param {Object} boundaries The boundaries to calculate the precisions from.
   * @return {number} The calculated precison to work with.
   */
  static caluclatePrecisionFromBoundaries(boundaries) {
    let precision;
    const distBtwBoundaries = this.distBtwLocations(
      { 
        lat: boundaries.sw.lat, 
        lng: boundaries.sw.lng,
      }, 
      { 
        lat: boundaries.ne.lat, 
        lng: boundaries.ne.lng,
      },
    );
    
    if (distBtwBoundaries < 0.02) {
      precision = 9;
    } else if (distBtwBoundaries < 0.1) {
      precision = 8;
    }  else if (distBtwBoundaries < 0.7) {
      precision = 7;
    }  else if (distBtwBoundaries < 4) {
      precision = 6;
    } else if (distBtwBoundaries < 25) {
      precision = 5;
    } else if (distBtwBoundaries < 150) {
      precision = 4;
    } else if (distBtwBoundaries < 800) {
      precision = 3;
    } else if (distBtwBoundaries <  4000) {
      precision = 2;
    } else {
      precision = 1;
    }

    return precision;
  }

  /**
   * Converts degrees to radians.
   * 
   * @param {number} degrees The string with the number of degrees to convert.
   * @return {number} The converted radians.
   */
  static degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
}