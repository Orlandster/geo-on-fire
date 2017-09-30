import { expect } from 'chai';
import { GofCoordinatesValidation } from '../../src/validation/validators/coordinates.validation';

describe('Tests for class GofCoordinatesValidation', () => {
  let coordinates;
  let errorInfos;

  before(() => {
    coordinates = GofCoordinatesValidation;
    errorInfos = { fName: 'test()', p1: 'random', p2: 'more random' };
  });

  describe('validateLat()', () => {
    it('invalid data should throw an error', () => {
      expect(coordinates.validateLat.bind(coordinates, '90', errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLat.bind(coordinates, 91, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLat.bind(coordinates, -91, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLat.bind(coordinates, 90.1, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLat.bind(coordinates, -90.1, errorInfos.fName, errorInfos.p1)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(coordinates.validateLat.bind(coordinates, 12, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, -12, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, 34.342, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, -34.342, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, 90, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, -90, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLat.bind(coordinates, 0, errorInfos.fName, errorInfos.p1)).to.not.throw();
    });
  });

  describe('validateLng()', () => {
    it('invalid data should throw an error', () => {
      expect(coordinates.validateLat.bind(coordinates, '180', errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLng.bind(coordinates, 181, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLng.bind(coordinates, -181, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLng.bind(coordinates, 180.1, errorInfos.fName, errorInfos.p1)).to.throw();
      expect(coordinates.validateLng.bind(coordinates, -180.1, errorInfos.fName, errorInfos.p1)).to.throw();
    });
  
    it('valid data should not throw an error', () => {
      expect(coordinates.validateLng.bind(coordinates, 12, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, -12, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, 34.342, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, -34.342, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, 180, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, -180, errorInfos.fName, errorInfos.p1)).to.not.throw();
      expect(coordinates.validateLng.bind(coordinates, 0, errorInfos.fName, errorInfos.p1)).to.not.throw();
    });
  });
});