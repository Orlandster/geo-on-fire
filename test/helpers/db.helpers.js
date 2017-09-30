import { initialData } from '../data/firebase.data.es6.js';

export class dbHelpers {

  constructor() {}

  static getPathFromUrl(url) {
    return url.toString().substring(url.root.toString().length-1);
  }

  static reinitializeDb(db) {
    return db.set(JSON.parse(initialData));
  }

  static resetDb(db) {
    db.set();
  }
}