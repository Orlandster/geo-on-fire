import { expect } from "chai";
import GofDbListeners from "../src/gof-db-listeners";

describe("Tests for class GofDbListeners", () => {
  const geohashes = ["9qpbq", "9qpby", "9qpbw", "9qpbz"];
  const event = new Event("test");
  let db = {};

  before(() => {
    db = {
      entries: window.dbRef.child("entries"),
      geohashes: window.dbRef.child("entries-geo"),
    }
  });

  describe("attachDbListeners()", () => {
    it("should create the correct amount of event listeners", () => {
      expect(GofDbListeners.attachDbListeners("value", db, geohashes, event).length).to.be.equal(4);
      expect(GofDbListeners.attachDbListeners("child_added", db, geohashes, event).length).to.be.equal(4);
      expect(GofDbListeners.attachDbListeners("child_changed", db, geohashes, event).length).to.be.equal(4);
      expect(GofDbListeners.attachDbListeners("child_removed", db, geohashes, event).length).to.be.equal(4);
    });

    it("listeners should be of type function", () => {
      GofDbListeners.attachDbListeners("value", db, geohashes, event).forEach(listener => {
        expect(typeof listener).to.be.equal("object");
      });

      GofDbListeners.attachDbListeners("child_added", db, geohashes, event).forEach(listener => {
        expect(typeof listener).to.be.equal("object");
      });

      GofDbListeners.attachDbListeners("child_changed", db, geohashes, event).forEach(listener => {
        expect(typeof listener).to.be.equal("object");
      });

      GofDbListeners.attachDbListeners("child_removed", db, geohashes, event).forEach(listener => {
        expect(typeof listener).to.be.equal("object");
      });
    });
  });
});