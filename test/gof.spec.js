import { expect } from 'chai';
import Gof from '../src/gof';
import { dbHelpers } from './helpers/db.helpers';

describe('Tests for class Gof', () => {
  const geohashes = ["9qpbq", "9qpby", "9qpbw", "9qpbz"];
  const event = new Event("test");
  let gof;

  before(() => {
    gof = new Gof('entries', window.dbRef);
  });

  describe("Gof()", () => {
    it("parameters should be validated", () => {
      // just to check if validators are in use
      expect(Gof
        .bind(Gof, 34234, window.dbRef))
        .to.throw();
    });

    it("utils should get initialized correct", () => {
      expect(typeof gof._utils).to.be.equal("function");
      expect(gof._utils.name).to.be.equal("GofUtils");
    });

    it("db should get initialized correct", () => {
      expect(typeof gof._db).to.be.equal("object");
      expect(gof._db.constructor.name).to.be.equal("GofDb");
    });

    it("events should get attached", () => {
      expect(typeof gof.getLocationsByRadius.on).to.be.equal("function");
      expect(typeof gof.getLocationsByRadius.once).to.be.equal("function");
      expect(typeof gof.getLocationsByBoundaries.on).to.be.equal("function");
      expect(typeof gof.getLocationsByBoundaries.once).to.be.equal("function");
    });

    it("activeQuery should get initialized", () => {
      expect(typeof gof._activeQuery).to.be.equal("object");
      expect(typeof gof._activeQuery.geohashes).to.be.equal("object");
      expect(typeof gof._activeQuery.entries).to.be.equal("object");
      expect(typeof gof._activeQuery.parameters).to.be.equal("object");
      expect(typeof gof._activeQuery.dbListeners).to.be.equal("object");
    });
  });

  describe("getLocationsByRadius()", () => {
    it("validators should be called", () => {
      // just to check if validators are in use (no tests for the validators itself)
      expect(gof.getLocationsByRadius
        .bind(gof, '34234'))
        .to.throw();
    });

    it("should return the right context", () => {
      expect(gof.getLocationsByRadius({ lat: 33.8324, lng: -112.5584 }, 8.5, 1, 5))
        .to.be.equal(gof.getLocationsByRadius);
    });

    describe("on()", () => {
      it("validators should be called", () => {
        // just to check if validators are in use (no tests for the validators itself)
        expect(gof.getLocationsByRadius({ lat: 33.8324, lng: -112.5584 }, 8.5, 1, 2).on
          .bind(gof.getLocationsByRadius, 23342344))
          .to.throw();
      });
    });
  });

  describe("getLocationsByBoundaries()", () => {
    let locationByBounds

    before((done) => {
      locationByBounds = gof.getLocationsByBoundaries({ sw: { lat: 33.8224, lng: -112.5684 }, ne: { lat: 33.84924, lng: -112.5484 } }, 1,  2);
      done();
    })

    it("validators should be called", () => {
      // just to check if validators are in use (no tests for the validators itself)
      expect(gof.getLocationsByBoundaries
        .bind(gof, '34234'))
        .to.throw();
    });

    it("should return the right context", () => {
      expect(locationByBounds)
        .to.be.equal(gof.getLocationsByBoundaries);
    });

    describe("on()", () => {
      it("validators should be called", () => {
        // just to check if validators are in use (no tests for the validators itself)
        expect(locationByBounds.on
          .bind(gof.getLocationsByBoundaries, 23342344))
          .to.throw();
      });

      describe("on value event", () => {
        let valueListener;
        let initialized = false;

        before(() => {
          gof.destroy();
          valueListener = locationByBounds.on("value");
        });

        it("should fire add, update and delete action correctly", (done) => {
          let addEntryCycles = 0;
          let updateEntryCycles = 0;
          let removeEntryCycles = 0;

          valueListener
            .then((entries) => {
              if (initialized) {
                if (addEntryCycles === 0) {
                  addEntryCycles++;
                  expect(addEntryCycles).to.be.equal(1);
                  done();
                } else if (updateEntryCycles === 0) {
                  updateEntryCycles++;
                  expect(updateEntryCycles).to.be.equal(1);
                  done();
                } else if (removeEntryCycles === 0) {
                  removeEntryCycles++;
                  expect(removeEntryCycles).to.be.equal(1);
                  done();
                }
                
                // no else statment to make sure every action gets just called once
              } else {
                // initial load
                done();
              }
            });
        });

        it("create entry should fire once", (done) => {
          setTimeout(() => {
            gof.createEntry({ location: { lat: 33.8326, lng: -112.5584 } }).then(data => {
              initialized = true;
              done()
            })
          }, 10)
        });

        it("update entry should fire once", (done) => {
          setTimeout(() => {
            gof.updateEntryLocation('-KulmMZDIECtqeuuhWFi', { location: { lat: 33.8334, lng: -112.5584 }, minPrecision: 5, maxPrecision: 9 })
              .then(data => {
                done()
              });
          }, 20)
        });

        it("delete entry should fire once", (done) => {
          setTimeout(() => {
            gof.deleteEntry('-KulmMZDIECtqeuuhWFi')
              .then(data => {
                done()
              });
          }, 30)
        });
      });

      describe("on child_added event", () => {
        let valueListener;
        let initialized = false;

        before(() => {
          gof.destroy();
          dbHelpers.reinitializeDb(window.dbRef)
          valueListener = locationByBounds.on("child_added");
        });

        it("should fire add action correctly", (done) => {
          let addEntryCycles = 0;

          valueListener
            .then((entries) => {
              if (initialized) {
                addEntryCycles++;
                // this makes sure the listener just get called once
                expect(addEntryCycles).to.be.equal(1);
                done();
              } else {
                // initial load
                done();
              }
            });
        });

        it("create entry should fire once", (done) => {
          setTimeout(() => {
            gof.createEntry({ location: { lat: 33.8326, lng: -112.5584 } }).then(data => {
              initialized = true;
              done()
            })
          }, 10)
        });

        it("update entry should not fire", (done) => {
          setTimeout(() => {
            gof.updateEntryLocation('-KulmMZDIECtqeuuhWFi', { location: { lat: 33.8334, lng: -112.5584 }, minPrecision: 5, maxPrecision: 9 })
              .then(data => {
                done()
              });
          }, 20)
        });

        it("delete entry should not fire", (done) => {
          setTimeout(() => {
            gof.deleteEntry('-KulmMZDIECtqeuuhWFi')
              .then(data => {
                done()
              });
          }, 30)
        });
      });

      describe("on child_changed event", () => {
        let valueListener;
        let initialized = false;

        before(() => {
          gof.destroy();
          dbHelpers.reinitializeDb(window.dbRef)
          valueListener = locationByBounds.on("child_changed");
        });

        it("should fire update action correctly", (done) => {
          let updateEntryCycles = 0;

          valueListener
            .then((entries) => {
              if (initialized) {
                updateEntryCycles++;
                expect(updateEntryCycles).to.be.equal(1);
                done();
              } else {
                // initial load
                done();
              }
            });
        });

        it("create entry should not fire", (done) => {
          setTimeout(() => {
            gof.createEntry({ location: { lat: 33.8326, lng: -112.5584 } }).then(data => {
              initialized = true;
              done()
            })
          }, 10)
        });

        it("update entry should fire once", (done) => {
          setTimeout(() => {
            gof.updateEntryLocation('-KulmMZDIECtqeuuhWFi', { location: { lat: 33.8334, lng: -112.5584 }, minPrecision: 5, maxPrecision: 9 })
              .then(data => {
                done()
              });
          }, 20)
        });

        it("delete entry should not fire", (done) => {
          setTimeout(() => {
            gof.deleteEntry('-KulmMZDIECtqeuuhWFi')
              .then(data => {
                done()
              });
          }, 30)
        });
      });

      describe("on child_removed event", () => {
        let valueListener;
        let initialized = false;

        before(() => {
          gof.destroy();
          dbHelpers.reinitializeDb(window.dbRef)
          valueListener = locationByBounds.on("child_removed");
        });

        it("should fire update action correctly", (done) => {
          let removeEntryCycles = 0;

          valueListener
            .then((entries) => {
              if (initialized) {
                removeEntryCycles++;
                expect(removeEntryCycles).to.be.equal(1);
                done();
              } else {
                // initial load
                done();
              }
            });
        });

        it("create entry should not fire", (done) => {
          setTimeout(() => {
            gof.createEntry({ location: { lat: 33.8326, lng: -112.5584 } }).then(data => {
              initialized = true;
              done()
            })
          }, 10)
        });

        it("update entry should not fire", (done) => {
          setTimeout(() => {
            gof.updateEntryLocation('-KulmMZDIECtqeuuhWFi', { location: { lat: 33.8334, lng: -112.5584 }, minPrecision: 5, maxPrecision: 9 })
              .then(data => {
                done()
              });
          }, 20)
        });

        it("remove entry should fire once", (done) => {
          setTimeout(() => {
            gof.deleteEntry('-KulmMZDIECtqeuuhWFi')
              .then(data => {
                done()
              });
          }, 30)
        });
      });
    });
  });

  describe("createEntry()", () => {
    let createEntry;

    before(() => {
      gof.destroy();
      dbHelpers.reinitializeDb(window.dbRef);
      createEntry = gof.createEntry({ location: { lat: 21.8324, lng: -112.5584 } });
    })

    it("validators should be called", () => {
      // just to check if validators are in use (no tests for the validators itself)
      expect(gof.createEntry
        .bind(gof, '34234'))
        .to.throw();
    });

    it("should add the entry correctly to the database", (done) => {
      let key;

      createEntry
        .then(() => gof._db._refs.geohashes.child("97zunwmqz").once("value"))
        .then(location => {
          key = Object.keys(location.val())[0];
          expect(location.val()[Object.keys(location.val())[0]])
            .to.be.deep.equal({ lat: 21.8324, lng: -112.5584 })
          
          return gof._db._refs.geohashes.child("97zunwmq").once("value");
        })
        .then(location => {
          expect(location.val()[Object.keys(location.val())[0]])
            .to.be.deep.equal({ lat: 21.8324, lng: -112.5584 })
            
          return gof._db._refs.geohashes.child("97zunwm").once("value");
        })
        .then(location => {
          expect(location.val()[Object.keys(location.val())[0]])
            .to.be.deep.equal({ lat: 21.8324, lng: -112.5584 })
              
          return gof._db._refs.geohashes.child("97zunw").once("value");
        })
        .then(location => {
          expect(location.val()[Object.keys(location.val())[0]])
            .to.be.deep.equal({ lat: 21.8324, lng: -112.5584 })
                
          return gof._db._refs.geohashes.child("97zun").once("value");
        })
        .then(location => {
          expect(location.val()[Object.keys(location.val())[0]])
            .to.be.deep.equal({ lat: 21.8324, lng: -112.5584 })
                  
          return gof._db._refs.entries.child(key).once("value");
        })
        .then(entry => {
          expect(entry.val())
            .to.be.deep.equal({ location: { lat: 21.8324, lng: -112.5584 }, maxPrecision: 9, minPrecision: 5 })
                    
          done();
        });
    });
  });

  describe("updateEntryLocation()", () => {
    let updateEntryLocation;

    before((done) => {
      gof.destroy();
      dbHelpers.reinitializeDb(window.dbRef);
      updateEntryLocation = gof.updateEntryLocation(
        "-KulmMZDIECtqeuuhWFi", 
        { 
          location: { 
            lat: 33.835419, 
            lng: -112.5584, 
          }, 
          name: 'orlandster', 
          minPrecision: 5, 
          maxPrecision: 9, 
        }
      );
      done()
    })

    it("validators should be called", () => {
      // just to check if validators are in use (no tests for the validators itself)
      expect(gof.updateEntryLocation
        .bind(gof, '34234'))
        .to.throw();
    });

    it("should update the entry correctly to the database", (done) => {
      updateEntryLocation
        .then(() => gof._db._refs.geohashes.child("9qpbqxt3x/-KulmMZDIECtqeuuhWFi").once("value"))
        .then(location => {
          expect(location.val())
            .to.be.deep.equal({ lat: 33.835419, lng: -112.5584 });

          // returns new geohash
          return gof._db._refs.geohashes.child("9qpbqxt3/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.deep.equal({ lat: 33.835419, lng: -112.5584 });

          // returns new geohash
          return gof._db._refs.geohashes.child("9qpbqxt/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.deep.equal({ lat: 33.835419, lng: -112.5584 });
  
          // returns existing geohash
          return gof._db._refs.geohashes.child("9qpbqx/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.deep.equal({ lat: 33.835419, lng: -112.5584 });
  
          // returns existing geohash
          return gof._db._refs.geohashes.child("9qpbq/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.deep.equal({ lat: 33.835419, lng: -112.5584 });
  
          // returns old, hopefully removed geohash
          return gof._db._refs.geohashes.child("9qpbqxj2p/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
    
          // returns old, hopefully removed geohash
          return gof._db._refs.geohashes.child("9qpbqxj2/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
      
          // returns old, hopefully removed geohash
          return gof._db._refs.geohashes.child("9qpbqxj/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
        
          // returns the entry itself
          return gof._db._refs.entries.child("-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(entry => {
          expect(entry.val())
            .to.be.deep.equal({ 
              location: { 
                lat: 33.835419, 
                lng: -112.5584, 
              }, 
              name: 'orlandster', 
              minPrecision: 5, 
              maxPrecision: 9, 
            });
          
          done();
        })
    });
  });

  describe("deleteEntry()", () => {
    let deleteEntry;

    before((done) => {
      gof.destroy();
      dbHelpers.reinitializeDb(window.dbRef);
      deleteEntry = gof.deleteEntry('-KulmMZDIECtqeuuhWFi');
      done()
    })

    it("validators should be called", () => {
      // just to check if validators are in use (no tests for the validators itself)
      expect(gof.deleteEntry
        .bind(gof, 23342344))
        .to.throw();
    });

    it("should delete the entry correctly from the database", (done) => {
      deleteEntry
        .then((data) => {
            return gof._db._refs.geohashes.child("9qpbqxj2p/-KulmMZDIECtqeuuhWFi").once("value")
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
          
          return gof._db._refs.geohashes.child("9qpbqxj2/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
            
          return gof._db._refs.geohashes.child("9qpbqxj/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
              
          return gof._db._refs.geohashes.child("9qpbqx/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
                
          return gof._db._refs.geohashes.child("9qpbq/-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(location => {
          expect(location.val())
            .to.be.null;
                  
          return gof._db._refs.entries.child("-KulmMZDIECtqeuuhWFi").once("value");
        })
        .then(entry => {
          expect(entry.val())
            .to.be.null;
                  
          done();
        })
    });
  });
});