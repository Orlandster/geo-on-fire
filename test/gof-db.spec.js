import { expect } from "chai";
import { GofDb } from "../src/gof-db";
import { dbHelpers } from "./helpers/db.helpers";

describe("Tests for class GofDb", () => {
  let db;

  before(() => {
    db = new GofDb("entries", window.dbRef);
  });

  describe("GofDb()", () => {
    it("entries path should be /entries", () => {
      expect(dbHelpers.getPathFromUrl(db._refs.entries)).to.be.equal("/test/entries");
    });

    it("locations path should be /entries-geo", () => {
      expect(dbHelpers.getPathFromUrl(db._refs.geohashes)).to.be.equal("/test/entries-geo");
    });

    it("utils ref should be a function", () => {
      expect(typeof db._utils).to.be.equal("function");
    });
  });


  describe("pushEntry()", () => {
    let pushEntry;

    before(() => {
      pushEntry = db.pushEntry({ location: { lat: 33.8324, lng: -112.5584 } })
    });

    it("pushEntry should of type object", () => {
      expect(typeof pushEntry).to.be.equal("object");
    });

    it("new entries path should be /entries/{pushKey}", () => {
      expect(dbHelpers.getPathFromUrl(pushEntry)).to.be.equal(`/test/entries/${pushEntry.key}`);
    });

    it("data should be added correct do the database", (done) => {
      pushEntry.then(snap => {
        return db._refs.entries.child(snap.key).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal({ location: { lat: 33.8324, lng: -112.5584 } });
        done();
      })
    });
  });

  describe("setGeohashLocations()", () => {
    let geohashLocations;
    let coordinates;
    let geohashes;

    before(() => {
      coordinates = { lat: 53.8324, lng: -102.5584 };
      geohashLocations = db.setGeohashLocations(
        "-KufcJJae6YVd-wqc1eG", 
        coordinates, 
        ["c9x44pzk2", "c9x44pzk", "c9x44pz", "c9x44p", "c9x44"]
      );
    });

    it("geohashLocations should be of type object", () => {
      expect(typeof geohashLocations).to.be.equal("object");
    });

    it("geohashLocations should be a promise", () => {
      expect(typeof geohashLocations.then).to.be.equal("function");
    });

    it("geohashLocations should be a promise", () => {
      expect(typeof geohashLocations.then).to.be.equal("function");
    });

    it("geohashLocations should be added correct do the database", (done) => {
      const pushKey = "-KufcJJae6YVd-wqc1eG";

      geohashLocations.then(() => {
        return db._refs.geohashes.child("c9x44pzk2").child(pushKey).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal(coordinates);
        return db._refs.geohashes.child("c9x44pzk").child(pushKey).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal(coordinates);
        return db._refs.geohashes.child("c9x44pz").child(pushKey).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal(coordinates);
        return db._refs.geohashes.child("c9x44p").child(pushKey).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal(coordinates);
        return db._refs.geohashes.child("c9x44").child(pushKey).once("value");
      })
      .then(snap => {
        expect(snap.val()).to.be.deep.equal(coordinates);
        return db._refs.geohashes.child("c9x4").child(pushKey).once("value");
      })      
      .then(snap => {
        expect(snap.val()).to.be.null;
        done();
      })
    });
  });

  describe("fetchLocations()", () => {
    let fetchedLocations;

    before((done) => {
      dbHelpers.reinitializeDb(global.dbRef).then(() => {
        fetchedLocations = db.fetchLocations(
          ["-KulmMZDIECtqeuuhWFi", "-Kulrx9UUYvhT5iSbVPE"], 1, 2
        );
        done();
      });
    });

    it("fetchedLocations should be of type object", () => {
      expect(typeof fetchedLocations).to.be.equal("object");
    });

    it("fetchedLocations should be a promise", () => {
      expect(typeof fetchedLocations.then).to.be.equal("function");
    });

    it("correct entries should be returned", (done) => {
      fetchedLocations.then(entries => {
        expect(entries.length).to.be.equal(2);

        entries.map(entry => {
          expect(entry.val()).to.be.deep.equal(
            { 
              location: { lat: 33.8324, lng: -112.5584 },
              maxPrecision: 9,
              minPrecision: 5,
              name: "yoho",
            });
        });

        done();
      })
    });
  });

  describe("getLocationsFromGeohashes()", () => {
    let locationsFromGeohashes;

    before((done) => {
      dbHelpers.reinitializeDb(global.dbRef).then(() => {
        locationsFromGeohashes = db.getLocationsFromGeohashes(
          ["9qpbq", "9qpby", "9qpbw", "9qpbz"]
        );
        done();
      });
    });

    it("locations should be of type object", () => {
      expect(typeof locationsFromGeohashes).to.be.equal("object");
    });

    it("locations should be a promise", () => {
      expect(typeof locationsFromGeohashes.then).to.be.equal("function");
    });

    it("correct locations should be returned", (done) => {
      locationsFromGeohashes.then(locations => {
        expect(locations.length).to.be.equal(4);
        
        locations.map((location, i) => {
          if (i == 0) {
            // first geohash node should contain values
            expect(location.val()).to.be.deep.equal(
              { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 },
              "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } }
            );
          } else {
            // others should be null
            expect(location.val()).to.be.null;
          }
        });

        done();
      })
    });
  });

  describe("updateEntry()", () => {
    let updateEntry;

    before((done) => {
      dbHelpers.reinitializeDb(global.dbRef).then(() => {
        updateEntry = db.updateEntry(
          "-KulmMZDIECtqeuuhWFi", 
          { location: { lat: 35.8324, lng: 104.5584 }, minPrecision: 5, maxPrecision: 9 }, 5
        );
        done();
      });
    });

    it("updateEntry should be of type object", () => {
      expect(typeof updateEntry).to.be.equal("object");
    });

    it("updateEntry should be a promise", () => {
      expect(typeof updateEntry.then).to.be.equal("function");
    });

    it("entry should be correctly updated", (done) => {
      updateEntry
        .then(() => db._refs.entries.once("value"))
        .then(entries => {
          // check if the entry was updated correctly
          expect(entries.val()).to.be.deep.equal(
            { 
              "-KulmMZDIECtqeuuhWFi": { 
                location: { lat: 35.8324, lng: 104.5584 },
                maxPrecision: 9,
                minPrecision: 5,
                name: "yoho", 
              },
              "-Kulrx9UUYvhT5iSbVPE": { 
                location: { lat: 33.8324, lng: -112.5584 },
                maxPrecision: 9,
                minPrecision: 5,
                name: "yoho", 
              }, 
            }
          );

          return db._refs.geohashes.once("value");
        })
        .then(locations => {
        // check if locations we"re deleted and set correctly
          expect(locations.val()).to.be.deep.equal(
            { 
              "9qpbq": { "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqx": { "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj": { "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj2": { "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj2p": { "-Kulrx9UUYvhT5iSbVPE": { lat: 33.8324, lng: -112.5584 } },
              wq67g: { "-KulmMZDIECtqeuuhWFi": { lat: 35.8324, lng: 104.5584 } },
              wq67g7: { "-KulmMZDIECtqeuuhWFi": { lat: 35.8324, lng: 104.5584 } },
              wq67g71: { "-KulmMZDIECtqeuuhWFi": { lat: 35.8324, lng: 104.5584 } },
              wq67g714: { "-KulmMZDIECtqeuuhWFi": { lat: 35.8324, lng: 104.5584 } },
              wq67g714g: { "-KulmMZDIECtqeuuhWFi": { lat: 35.8324, lng: 104.5584 } },
            }
          );
          done();
      });
    });
  });

  describe("deleteEntry()", () => {
    let deleteEntry;

    before((done) => {
      dbHelpers.reinitializeDb(global.dbRef).then(() => {
        deleteEntry = db.deleteEntry("-Kulrx9UUYvhT5iSbVPE");
        done();
      });
    });

    it("deleteEntry should be of type object", () => {
      expect(typeof deleteEntry).to.be.equal("object");
    });

    it("deleteEntry should be a promise", () => {
      expect(typeof deleteEntry.then).to.be.equal("function");
    });

    it("correct entry should be deleted", (done) => {
      deleteEntry
        .then(() => db._refs.entries.once("value"))
        .then(entries => {
          expect(entries.val()).to.be.deep.equal(
            { 
              "-KulmMZDIECtqeuuhWFi": { 
                location: { lat: 33.8324, lng: -112.5584 },
                maxPrecision: 9,
                minPrecision: 5,
                name: "yoho", 
              }, 
            }
          );

          return db._refs.geohashes.once("value");
        })
        .then(locations => {
          expect(locations.val()).to.be.deep.equal(
            { 
              "9qpbq": { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqx": { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj": { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj2": { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 } },
              "9qpbqxj2p": { "-KulmMZDIECtqeuuhWFi": { lat: 33.8324, lng: -112.5584 } },
            }
          );
          done();
        })
    });
  });

  describe("getLocationNodesToAdd()", () => {
    let nodesToAdd;

    before(() => {
      nodesToAdd = db.getLocationNodesToAdd(
        "-KuVr8odlAWF4KHHmKAB", 
        { lat: 33.8324, lng: -112.5584 },
        ["wq67g714g", "wq67g714", "wq67g71", "wq67g7", "wq67g"]
      );
    });

    it("nodesToAdd should contain 5 items", () => {
      expect(nodesToAdd.length).to.be.equal(5);
    });
    
    it("nodesToAdd should be of type promise", () => {
      expect(typeof nodesToAdd[0].then).to.be.equal("function");
    });
  });

  describe("getLocationNodesToUpdate()", () => {
    let nodesToUpdate;

    before(() => {
      nodesToUpdate = db.getLocationNodesToUpdate(
        "-KuVr8odlAWF4KHHmKAB", 
        { lat: 33.8324, lng: -112.5584 },
        ["wq67g714g", "wq67g714", "wq67g71", "wq67g7", "wq67g"]
      );
    });

    it("nodesToAdd should contain 5 items", () => {
      expect(nodesToUpdate.length).to.be.equal(5);
    });
    
    it("nodesToAdd should be of type promise", () => {
      expect(typeof nodesToUpdate[0].then).to.be.equal("function");
    });
  });

  describe("getLocationNodesToDelete()", () => {
    let nodesToDelete;

    before(() => {
      nodesToDelete = db.getLocationNodesToDelete(
        "-KuVr8odlAWF4KHHmKAB", 
        ["wq67g714g", "wq67g714", "wq67g71", "wq67g7", "wq67g"]
      );
    });

    it("nodesToDelete should contain 5 items", () => {
      expect(nodesToDelete.length).to.be.equal(5);
    });
    
    it("nodesToDelete should be of type promise", () => {
      expect(typeof nodesToDelete[0].then).to.be.equal("function");
    });
  });
});