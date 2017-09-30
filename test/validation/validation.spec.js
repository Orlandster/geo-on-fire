import { expect } from "chai";
import { GofValidation } from "../../src/validation/validation";

describe("Tests for class GofValidation", () => {
  describe("validateConstructor()", () => {
    let fName;
    let db;

    before(() => {
      fName = "geoOnFire()";
      db =  global.dbRef;
    });

    describe("Parameter: name", () => {
      it("name of type number should be invalid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, 12323, db, fName))
          .to.throw(`${fName} - name must be of type string!`);
      });

      it("Special chars in name should be invalid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, "events!", db, fName))
          .to.throw(`${fName} - name should not contain special chars!`);
      });

      it("name as single word should be valid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, "events", db, fName))
          .to.not.throw();
      });

      it("Space seperated name should be valid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, "events bla", db, fName))
          .to.not.throw();
      });
    });

    describe("Parameter: db", () => {
      it("Database reference of type string should be invalid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, "events", "db", fName))
          .to.throw(`${fName} - firebase.database() must be of type object!`);
      });

      it("Firebase.database() should be a valid", () => {
        expect(GofValidation.validateConstructor
          .bind(GofValidation, "events", db, fName))
          .to.not.throw();
      });
    });
  });

  describe("validateLocationsByRadius()", () => {
    let fName;

    before(() => {
      fName = "validateLocationsByRadius()";
    });

    describe("Parameter: center", () => {
      it("center of type number should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, 12323, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lat must be of type number!`);
      });

      it("center as empty object should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, {}, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lat must be of type number!`);
      });

      it("center with .lat out of positive range should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 137.8324, lng: 112.5384 }, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lat must be lower or same as 90!`);
      });

      it("Center with .lat out of negative range should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: -137.8324, lng: 112.5384 }, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lat must be higher or same as -90!`);
      });

      it("center with .lng out of positive range should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 212.5384 }, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lng must be lower or same as 180!`);
      });

      it("center with .lng out of negative range should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: -212.5384 }, 5, 1, 5, fName))
          .to.throw(`${fName} - center.lng must be higher or same as -180!`);
      });

      it("center with lat: 37.8324 and lng: 112.5384 should be valid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1, 5, fName))
          .to.not.throw();
      });
    });
    describe("Parameter: radius", () => {
      it("radius of type string should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, "4", 1, 5, fName))
          .to.throw(`${fName} - radius must be of type number!`);
      });

      it("radius with a lower value than 0 should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, -1, 1, 5, fName))
          .to.throw(`${fName} - radius must be higher or same as 0!`);
      });

      it("radius with NaN as value should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, NaN, 1, 5, fName))
          .to.throw(`${fName} - radius should not contain the value NaN!`);
      });

      it("radius with decimal places should be valid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5.1, 1, 5, fName))
          .to.not.throw();
      });

      it("radius of 5 should be valid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1, 5, fName))
          .to.not.throw();
      });
    });
    describe("Parameter: startAt", () => {
      it("startAt of type string should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, "1", 5, fName))
          .to.throw(`${fName} - startAt must be of type number!`);
      });
      it("startAt with a lower value than 1 should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 0, 5, fName))
          .to.throw(`${fName} - startAt must be higher or same as 1`);
      });
      it("startAt with decimal places should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1.1, 5, fName))
          .to.throw(`${fName} - startAt should not contain decimal places!`);
      });
      it("startAt with a bigger value than endAt should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 10, 5, fName))
          .to.throw(`${fName} - startAt must be lower or same as endAt!`);
      });
      it("startAt with a value of 1 and endAt with a value of 5 should be valid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1, 5, fName))
          .to.not.throw();
      });
    });

    describe("Parameter: endAt", () => {
      it("endAt of type string should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1, "5", fName))
          .to.throw(`${fName} - endAt must be of type number!`);
      });

      it("endAt with decimal places should be invalid", () => {
        expect(GofValidation.validateLocationsByRadius
          .bind(GofValidation, { lat: 37.8324, lng: 112.5384 }, 5, 1, 5.1, fName))
          .to.throw(`${fName} - endAt should not contain decimal places!`);
      });
    });
  });

  describe("validateLocationsByBoundaries()", () => {
    let fName;

    before(() => {
      fName = "getLocationsByBoundaries()";
    });

    describe("Parameter: boundaries", () => {
      it("boundaries.sw.lat > boundaries.ne.lat should be invalid", () => {
        expect(GofValidation.validateLocationsByBoundaries
          .bind(GofValidation, { sw: { lat: 34.8224, lng: 112.5484 }, ne: { lat: 33.84924, lng: 112.5684 } }, 1,  5, fName))
          .to.throw(`${fName} - boundaries.sw.lat must be lower or same as boundaries.ne.lat!`);
      });

      it("boundaries.sw.lng > boundaries.ne.lng should be invalid", () => {
        expect(GofValidation.validateLocationsByBoundaries
          .bind(GofValidation, { sw: { lat: 33.8224, lng: 113.5484 }, ne: { lat: 33.84924, lng: 112.5684 } }, 1,  5, fName))
          .to.throw(`${fName} - boundaries.sw.lng must be lower or same as boundaries.ne.lng!`);
      });

      it("boundaries.sw.lat < boundaries.ne.lat and boundaries.sw.lng < boundaries.ne.lng should be valid", () => {
        expect(GofValidation.validateLocationsByBoundaries
          .bind(GofValidation, { sw: { lat: 33.8224, lng: 112.5484 }, ne: { lat: 33.84924, lng: 112.5684 } }, 1,  5, fName))
          .to.not.throw(`${fName} - boundaries.sw.lng must be lower or same as boundaries.ne.lng!`);
      });
    });
  });

  describe("validateCreateEntry()", () => {
    let fName;

    before(() => {
      fName = "createEntry()";
    });

    describe("Parameter: entry", () => {
      it("entry of type string should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: "33.8324", lng: -112.5584 } }, 5, 9, fName))
          .to.throw(`${fName} - entry.location.lat must be of type number!`);
      });

      it("entry should be valid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, 9, fName))
          .to.not.throw();
      });
    });

    describe("Parameter: priority", () => {
      it("priority of type string should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, "5", 9, fName))
          .to.throw(`${fName} - priority must be of type number!`);
      });

      it("priority of 6 should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 6, 9, fName))
          .to.throw(`${fName} - priority must be lower or same as 5!`);
      });

      it("priority of 0 should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 0, 9, fName))
          .to.throw(`${fName} - priority must be higher or same as 1!`);
      });

      it("priority with decimal places should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 3.1, 9, fName))
          .to.throw(`${fName} - priority should not contain decimal places!`);
      });

      it("priority of 5 should be valid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, 9, fName))
          .to.not.throw();
      });
    });
    describe("Parameter: maxPrecision", () => {
      it("maxPrecision of type string should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, "9", fName))
          .to.throw(`${fName} - maxPrecision must be of type number!`);
      });

      it("maxPrecision of 10 should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, 10, fName))
          .to.throw(`${fName} - maxPrecision must be lower or same as 9!`);
      });

      it("maxPrecision of 6 should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, 6, fName))
          .to.throw(`${fName} - maxPrecision must be higher or same as 7!`);
      });

      it("maxPrecision with decimal places should be invalid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 3, 9.3, fName))
          .to.throw(`${fName} - maxPrecision should not contain decimal places!`);
      });

      it("maxPrecision of 9 should be valid", () => {
        expect(GofValidation.validateCreateEntry
          .bind(GofValidation, { location: { lat: 33.8324, lng: -112.5584 } }, 5, 9, fName))
          .to.not.throw();
      });
    });
  });

  describe("validateUpdateEntryLocation()", () => {
    let fName;

    before(() => {
      fName = "updateEntryLocation()";
    });

    describe("Parameter: pushKey", () => {
      it("pushKey of type number should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, 123421342334, 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - pushKey must be of type string!`);
      });

      it("pushKey with special chars should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "!adfasddf", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - pushKey should not contain special chars!`);
      });

      it("pushKey with spaces should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "adfasddf dadf", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - pushKey should not contain white spaces!`);
      });

      it("pushKey with all the allowerd characters should be valid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, 
             // allowerd chars in a firebase push key
            "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.not.throw();
      });
    });

    describe("Parameter: newValue", () => {
      it("newValue.location.lat of type string should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: "35.8324", lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lat must be of type number!`);
      });

      it("newValue.location.lat out of positive range should be invalid ", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 135.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lat must be lower or same as 90!`);
      });

      it("newValue.location.lat out of negative range should be invalid ", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: -135.8324, lng: 104.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lat must be higher or same as -90!`);
      });

      it("newValue.location.lng of type string should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location:
              { lat: 35.8324, lng: "104.5584" },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lng must be of type number!`);
      });

      it("newValue.location.lng out of positive range should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 204.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lng must be lower or same as 180!`);
      });

      it("newValue.location.lng out of negative range should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: -204.5584 },
              minPrecision: 5, 
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - newValue.location.lng must be higher or same as -180!`);
      });

      it("minPrecision of 6 should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 6, // minPrecison == priority
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - priority must be lower or same as 5!`);
      });

      it("minPrecision of 0 should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 0, // minPrecison == priority
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.throw(`${fName} - priority must be higher or same as 1!`);
      });

      it("minPrecision of 5 should be valid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, // minPrecison == priority
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.not.throw();
      });

      it("maxPrecision of 6 should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, // minPrecison == priority
              maxPrecision: 6,
            }, 5, fName
          ))
          .to.throw(`${fName} - maxPrecision must be higher or same as 7!`);
      });

      it("maxPrecision of 10 should be invalid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, // minPrecison == priority
              maxPrecision: 10,
            }, 5, fName
          ))
          .to.throw(`${fName} - maxPrecision must be lower or same as 9!`);
      });

      it("maxPrecision of 9 should be valid", () => {
        expect(GofValidation.validateUpdateEntryLocation
          .bind(GofValidation, "-KuVr8odlAWF4KHHmKAB", 
            { location: 
              { lat: 35.8324, lng: 104.5584 },
              minPrecision: 5, // minPrecison == priority
              maxPrecision: 9,
            }, 5, fName
          ))
          .to.not.throw();
      });
    });
  });

  describe("validateDeleteEntry()", () => {
    let fName;

    before(() => {
      fName = "deleteEntry()";
    });

    describe("Parameter: pushKey", () => {
      it("pushKey of type number should be invalid", () => {
        expect(GofValidation.validateDeleteEntry
          .bind(GofValidation, 123421342334, fName))
          .to.throw(`${fName} - pushKey must be of type string!`);
      });

      it("pushKey with special chars should be invalid", () => {
        expect(GofValidation.validateDeleteEntry
          .bind(GofValidation, "!adfasddf", fName))
          .to.throw(`${fName} - pushKey should not contain special chars!`);
      });
      
      it("pushKey with spaces should be invalid", () => {
        expect(GofValidation.validateDeleteEntry
          .bind(GofValidation, "adfa sddf", fName))
          .to.throw(`${fName} - pushKey should not contain white spaces!`);
      });

      it("pushKey with all the allowerd characters should be valid", () => {
        expect(GofValidation.validateDeleteEntry
          .bind(GofValidation, 
            // allowerd chars in a firebase push key
            "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz", fName))
          .to.not.throw();
      });
    });
  });

  describe("validateOn()", () => {
    let fName;

    before(() => {
      fName = "on()";
    });

    describe("Parameter: type", () => {
      it("event type of type number should be invalid", () => {
        expect(GofValidation.validateOn
          .bind(GofValidation, 123421342334, fName))
          .to.throw(`${fName} - type must be of type string!`);
      });

      it("event type 'test' should be invalid", () => {
        expect(GofValidation.validateOn
          .bind(GofValidation, "test", fName))
          .to.throw(`${fName} - "test" is not a valid type. You have to use one of the follwoing types: "value", "child_added", "child_changed", "child_removed"`);
      });

      it("event type 'child_moved' should be invalid", () => {
        expect(GofValidation.validateOn
          .bind(GofValidation, "child_moved", fName))
          .to.throw(`${fName} - type of "child_moved" is not supported. You have to use one of the follwoing types: "value", "child_added", "child_changed", "child_removed"`);
      });
    });
  });
});