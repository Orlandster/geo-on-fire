import { expect } from 'chai';
import { GofBasicValidation } from '../../src/validation/validators/basic.validation';

describe('Tests for class GofBasicValidation', () => {
  let basic;
  let errorInfos;

  before(() => {
    basic = GofBasicValidation;
    errorInfos = { fName: 'test()', p1: 'random', p2: 'more random' };
  });

  describe('validateNumber()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.validateNumber.bind(basic, '2', errorInfos)).to.throw();
      expect(basic.validateNumber.bind(basic, {}, errorInfos)).to.throw();
      expect(basic.validateNumber.bind(basic, [], errorInfos)).to.throw();
      expect(basic.validateNumber.bind(basic, NaN, errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, () => {}, errorInfos)).to.throw();
      expect(basic.validateNumber.bind(basic, [1], errorInfos)).to.throw();
      expect(basic.validateNumber.bind(basic, undefined, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.validateNumber.bind(basic, 1, errorInfos)).to.not.throw();
      expect(basic.validateNumber.bind(basic, 234, errorInfos)).to.not.throw();
      expect(basic.validateNumber.bind(basic, -233, errorInfos)).to.not.throw();
      expect(basic.validateNumber.bind(basic, 2000, errorInfos)).to.not.throw();
      expect(basic.validateNumber.bind(basic, 0, errorInfos)).to.not.throw();
      expect(basic.validateNumber.bind(basic, 2200003330, errorInfos)).to.not.throw();
    });
  });

  describe('validateString()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.validateString.bind(basic, 1234, errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, {}, errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, [], errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, NaN, errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, () => {}, errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, ['1'], errorInfos)).to.throw();
      expect(basic.validateString.bind(basic, undefined, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.validateString.bind(basic, 'hi', errorInfos)).to.not.throw();
      expect(basic.validateString.bind(basic, 'hi John', errorInfos)).to.not.throw();
      expect(basic.validateString.bind(basic, 'hi John, ' + 'how are you?', errorInfos)).to.not.throw();
      expect(basic.validateString.bind(basic, `hi`, errorInfos)).to.not.throw();
    });
  });

  describe('validateFunction()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.validateFunction.bind(basic, 1234, errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, 'hi', errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, {}, errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, [], errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, NaN, errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, ['1'], errorInfos)).to.throw();
      expect(basic.validateFunction.bind(basic, undefined, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.validateFunction.bind(basic, () => {}, errorInfos)).to.not.throw();
      expect(basic.validateFunction.bind(basic, function () {}, errorInfos)).to.not.throw();
      expect(basic.validateFunction.bind(basic, (p1) => {}, errorInfos)).to.not.throw();
      expect(basic.validateFunction.bind(basic, function (p1) {}, errorInfos)).to.not.throw();
    });
  });

  describe('validateObject()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.validateObject.bind(basic, 1234, errorInfos)).to.throw();
      expect(basic.validateObject.bind(basic, 'hi', errorInfos)).to.throw();
      expect(basic.validateObject.bind(basic, () => {}, errorInfos)).to.throw();
      expect(basic.validateObject.bind(basic, NaN, errorInfos)).to.throw();
      expect(basic.validateObject.bind(basic, undefined, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.validateObject.bind(basic, {}, errorInfos)).to.not.throw();
      expect(basic.validateObject.bind(basic, { name: 'John' }, errorInfos)).to.not.throw();
      expect(basic.validateObject.bind(basic, [], errorInfos)).to.not.throw();
      expect(basic.validateObject.bind(basic, ['John'], errorInfos)).to.not.throw();
    });
  });

  describe('containsSpecialChars()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.containsSpecialChars.bind(basic, '!', errorInfos)).to.throw();
      expect(basic.containsSpecialChars.bind(basic, '?', errorInfos)).to.throw();
      expect(basic.containsSpecialChars.bind(basic, 'ä', errorInfos)).to.throw();
      expect(basic.containsSpecialChars.bind(basic, '$', errorInfos)).to.throw();
      expect(basic.containsSpecialChars.bind(basic, '<', errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.containsSpecialChars.bind(basic, 'hi', errorInfos)).to.not.throw();
      expect(basic.containsSpecialChars.bind(basic, 'hi John', errorInfos)).to.not.throw();
      expect(basic.containsSpecialChars.bind(basic, '123', errorInfos)).to.not.throw();
      expect(basic.containsSpecialChars.bind(basic, 'hi-john', errorInfos)).to.not.throw();
      expect(basic.containsSpecialChars.bind(basic, 'hi_john', errorInfos)).to.not.throw();
    });
  });

  describe('containsSpaces()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.containsSpaces.bind(basic, ' ', errorInfos)).to.throw();
      expect(basic.containsSpaces.bind(basic, '1 2 3', errorInfos)).to.throw();
      expect(basic.containsSpaces.bind(basic, ' 1', errorInfos)).to.throw();
      expect(basic.containsSpaces.bind(basic, '1 ', errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.containsSpaces.bind(basic, 'hi', errorInfos)).to.not.throw();
      expect(basic.containsSpaces.bind(basic, '123', errorInfos)).to.not.throw();
      expect(basic.containsSpaces.bind(basic, 'hi-john', errorInfos)).to.not.throw();
      expect(basic.containsSpaces.bind(basic, 'hi_john', errorInfos)).to.not.throw();
    });
  });

  describe('validateReference()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.validateReference.bind(basic, 1234, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, 'hi', errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, {}, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, [], errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, NaN, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, ['1'], errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, undefined, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, () => {}, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, function () {}, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, (p1) => {}, errorInfos)).to.throw();
      expect(basic.validateReference.bind(basic, function (p1) {}, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.validateReference.bind(basic, { child: () => {} }, errorInfos)).to.not.throw();
    });
  });

  describe('isLowerThan()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.isLowerThan.bind(basic, 1, 2, errorInfos)).to.throw();
      expect(basic.isLowerThan.bind(basic, -1, 10, errorInfos)).to.throw();
      expect(basic.isLowerThan.bind(basic, -2, 10, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.isLowerThan.bind(basic, 2, 1, errorInfos)).to.not.throw();
      expect(basic.isLowerThan.bind(basic, -1, -2, errorInfos)).to.not.throw();
      expect(basic.isLowerThan.bind(basic, 0, 0, errorInfos)).to.not.throw();
      expect(basic.isLowerThan.bind(basic, 20, 20, errorInfos)).to.not.throw();
    });
  });

  describe('isHigherThan()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.isHigherThan.bind(basic, 2, 1, errorInfos)).to.throw();
      expect(basic.isHigherThan.bind(basic, 10, -1, errorInfos)).to.throw();
      expect(basic.isHigherThan.bind(basic, 10, -2, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.isHigherThan.bind(basic, 1, 2, errorInfos)).to.not.throw();
      expect(basic.isHigherThan.bind(basic, -2, -1, errorInfos)).to.not.throw();
      expect(basic.isHigherThan.bind(basic, 0, 0, errorInfos)).to.not.throw();
      expect(basic.isHigherThan.bind(basic, 20, 20, errorInfos)).to.not.throw();
    });
  });

  describe('hasDecimalPlaces()', () => {
    it('invalid data should throw an error', () => {
      expect(basic.hasDecimalPlaces.bind(basic, 2.1, errorInfos)).to.throw();
      expect(basic.hasDecimalPlaces.bind(basic, -10.2, errorInfos)).to.throw();
      expect(basic.hasDecimalPlaces.bind(basic, 10.12234, errorInfos)).to.throw();
    });

    it('valid data should not throw an error', () => {
      expect(basic.hasDecimalPlaces.bind(basic, 1, errorInfos)).to.not.throw();
      expect(basic.hasDecimalPlaces.bind(basic, -2, errorInfos)).to.not.throw();
      expect(basic.hasDecimalPlaces.bind(basic, 200, errorInfos)).to.not.throw();
    });
  });

  describe('throwError()', () => {
    it('should throw error', () => {
      expect(basic.throwError.bind(basic, errorInfos.fName, 'error')).to.throw(`${errorInfos.fName} - error`);
      expect(basic.throwError.bind(basic, errorInfos.fName, 'bla bla')).to.throw(`${errorInfos.fName} - bla bla`);
      expect(basic.throwError.bind(basic, errorInfos.fName, '123 - 3 - 123 - 3')).to.throw(`${errorInfos.fName} - 123 - 3 - 123 - 3`);
    });
  });
});