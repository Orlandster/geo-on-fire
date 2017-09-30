import { expect } from 'chai';
import { GofUtils } from '../src/gof-utils.js';

describe('Tests for class GofUtils', () => {
  let _utils;

  before(() => {
    _utils = GofUtils;
  });

  describe('Geohashing', () => {
    describe('getGeohashByLocation()', () => {
      it('should return a 9 characters long geohash', () => {
        expect(_utils.getGeohashByLocation({ lat: 37.832, lng: 112.5584 }, 9)).to.be.equal('ww8p1r4e2');
        expect(_utils.getGeohashByLocation({ lat: 103.324, lng: -40.323 }, 9)).to.be.equal('gpgrfrvxv');
        expect(_utils.getGeohashByLocation({ lat: 23.324, lng: 100.323 }, 9)).to.be.equal('whpkdyhbp');
        expect(_utils.getGeohashByLocation({ lat: -53.324, lng: 22.44 }, 9)).to.be.equal('hqxbwssm1');
        expect(_utils.getGeohashByLocation({ lat: 8.722, lng: 10.333 }, 9)).to.be.equal('s1x3e5u32');
        expect(_utils.getGeohashByLocation({ lat: -22.722, lng: -50.333 }, 9)).to.be.equal('6gunwxsdu');
        expect(_utils.getGeohashByLocation({ lat: 180, lng: 90 }, 9)).to.be.equal('vzzzzzzzz');
      });

      it('should return a 6 characters long geohash', () => {
        expect(_utils.getGeohashByLocation({ lat: 37.832, lng: 112.5584 }, 6)).to.be.equal('ww8p1r');
        expect(_utils.getGeohashByLocation({ lat: 103.324, lng: -40.323 }, 6)).to.be.equal('gpgrfr');
        expect(_utils.getGeohashByLocation({ lat: 23.324, lng: 100.323 }, 6)).to.be.equal('whpkdy');
        expect(_utils.getGeohashByLocation({ lat: -53.324, lng: 22.44 }, 6)).to.be.equal('hqxbws');
        expect(_utils.getGeohashByLocation({ lat: 8.722, lng: 10.333 }, 6)).to.be.equal('s1x3e5');
        expect(_utils.getGeohashByLocation({ lat: -22.722, lng: -50.333 }, 6)).to.be.equal('6gunwx');
        expect(_utils.getGeohashByLocation({ lat: 180, lng: 90 }, 6)).to.be.equal('vzzzzz');
      });
    });

    describe('getGeohashPrecisions()', () => {
      it('should return geohash array with geohash precision 9, 8 and 7 in it', () => {
        expect(_utils.getGeohashPrecisions('ww8p1r4e2', 7, 9)).to.be.deep.equal(['ww8p1r4e2', 'ww8p1r4e', 'ww8p1r4']);
        expect(_utils.getGeohashPrecisions('gpgrfrvxv', 7, 9)).to.be.deep.equal(['gpgrfrvxv', 'gpgrfrvx', 'gpgrfrv']);
        expect(_utils.getGeohashPrecisions('whpkdyhbp', 7, 9)).to.be.deep.equal(['whpkdyhbp', 'whpkdyhb', 'whpkdyh']);
        expect(_utils.getGeohashPrecisions('hqxbwssm1', 7, 9)).to.be.deep.equal(['hqxbwssm1', 'hqxbwssm', 'hqxbwss']);
        expect(_utils.getGeohashPrecisions('s1x3e5u32', 7, 9)).to.be.deep.equal(['s1x3e5u32', 's1x3e5u3', 's1x3e5u']);
        expect(_utils.getGeohashPrecisions('6gunwxsdu', 7, 9)).to.be.deep.equal(['6gunwxsdu', '6gunwxsd', '6gunwxs']);
        expect(_utils.getGeohashPrecisions('vzzzzzzzz', 7, 9)).to.be.deep.equal(['vzzzzzzzz', 'vzzzzzzz', 'vzzzzzz']);
      });

      it('should return geohash array with geohash precision 7, 6 and 5 in it', () => {
        expect(_utils.getGeohashPrecisions('ww8p1r4', 5, 7)).to.be.deep.equal(['ww8p1r4', 'ww8p1r', 'ww8p1']);
        expect(_utils.getGeohashPrecisions('gpgrfrv', 5, 7)).to.be.deep.equal(['gpgrfrv', 'gpgrfr', 'gpgrf']);
        expect(_utils.getGeohashPrecisions('whpkdyh', 5, 7)).to.be.deep.equal(['whpkdyh', 'whpkdy', 'whpkd']);
        expect(_utils.getGeohashPrecisions('hqxbwss', 5, 7)).to.be.deep.equal(['hqxbwss', 'hqxbws', 'hqxbw']);
        expect(_utils.getGeohashPrecisions('s1x3e5u', 5, 7)).to.be.deep.equal(['s1x3e5u', 's1x3e5', 's1x3e']);
        expect(_utils.getGeohashPrecisions('6gunwxs', 5, 7)).to.be.deep.equal(['6gunwxs', '6gunwx', '6gunw']);
        expect(_utils.getGeohashPrecisions('vzzzzzz', 5, 7)).to.be.deep.equal(['vzzzzzz', 'vzzzzz', 'vzzzz']);
      });
    });

    describe('getGeohashesInBoundaries()', () => {
      it('should match the geohash array for precision of 5', () => {
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: 37.7724, lng: 112.4584 }, ne: { lat: 37.8924, lng: 112.6584 } }, 5))
          .to.be.deep.equal(
            ["wqxyz", "ww8nb", "ww8nc", "ww8nf", "ww8ng", "wqxzp", "ww8p0", "ww8p1", "ww8p4", "ww8p5", "wqxzr", "ww8p2", "ww8p3", "ww8p6", "ww8p7", "wqxzx", "ww8p8", "ww8p9", "ww8pd", "ww8pe"]);
  
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: -53.324, lng: 22.44 }, ne: { lat: -53.224, lng: 22.54 } }, 5))
          .to.be.deep.equal(
            ["hqxbw", "hqxbx", "hw808", "hqxby", "hqxbz", "hw80b", "hqxcn", "hqxcp", "hw810"]);
  
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: 103.324, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }, 5))
          .to.be.deep.equal(
            ["gpgrf", "gpgrg", "gpgru"]);
      });
  
      it('should match the geohash array for precision of 4', () => {
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: 37.7724, lng: 112.4584 }, ne: { lat: 37.8924, lng: 112.6584 } }, 4))
          .to.be.deep.equal(["wqxy", "ww8n", "wqxz", "ww8p"]);
  
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: -53.324, lng: 22.44 }, ne: { lat: -53.224, lng: 22.54 } }, 4))
          .to.be.deep.equal(["hqxb", "hw80", "hqxc", "hw81"]);
  
        expect(_utils.getGeohashesInBoundaries(
          { sw: { lat: 103.324, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }, 4))
          .to.be.deep.equal(["gpgr"]);
      });
    });

    describe('setPrecisionsForEntry()', () => {
      it('should return geohash array with geohash precision 9, 8 and 7 in it', () => {
        expect(_utils.setPrecisionsForEntry(5, {})).to.be.deep.equal({ minPrecision: 5, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(4, {})).to.be.deep.equal({ minPrecision: 4, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(3, {})).to.be.deep.equal({ minPrecision: 3, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(2, {})).to.be.deep.equal({ minPrecision: 2, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(1, {})).to.be.deep.equal({ minPrecision: 1, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(5, { name: 'John' })).to.be.deep.equal({ name: 'John', minPrecision: 5, maxPrecision: 9 });
        expect(_utils.setPrecisionsForEntry(5, { minPrecision: 6, maxPrecision: 9 })).to.be.deep.equal({ minPrecision: 5, maxPrecision: 9 });
      });
    });

    describe('getGeohashActions()', () => {
      it('should return the correct geohash actions', () => {
        expect(_utils.getGeohashActions(['hqxb', 'hw80', 'hqxc', 'hw81'], ['hqxb', 'hw80', 'hqxc', 'hw81']))
          .to.be.deep.equal(
            { add: [], delete: [], update: ['hqxb', 'hw80', 'hqxc', 'hw81'] }
          );

        expect(_utils.getGeohashActions(['hw80', 'hqxc', 'hw81'], ['hqxb', 'hw80', 'hqxc', 'hw81']))
          .to.be.deep.equal(
            { add: ['hqxb'], delete: [], update: ['hw80', 'hqxc', 'hw81'] }
          );

        expect(_utils.getGeohashActions(['hqxb', 'hw80', 'hqxc', 'hw81'], ['hw80', 'hqxc', 'hw81']))
          .to.be.deep.equal(
            { add: [], delete: ['hqxb'], update: ['hw80', 'hqxc', 'hw81'] }
          );

        expect(_utils.getGeohashActions(['hqxb', 'hw80', 'hqxc', 'hw81'], ['hw80', 'hqxc', 'hw81', 'hw82']))
          .to.be.deep.equal(
            { add: ['hw82'], delete: ['hqxb'], update: ['hw80', 'hqxc', 'hw81'] }
          );
      });
    })
  });

  describe('GeoQuery', () => {
    describe('by Boundaries', () => {
      describe('isInBoundaries()', () => {
        it('location should be within the boundaries', () => {
          expect(_utils.isInBoundaries(
            { lat: 37.783484, lng: -122.4117937 }, 
            { sw: { lat: 37.77765, lng: -122.4187887 }, ne: { lat: 37.789046, lng: -122.3947557 } }))
            .to.be.true;
    
          expect(_utils.isInBoundaries(
            { lat: -53.324, lng: -22.44 }, 
            { sw: { lat: -53.424, lng: -22.54 }, ne: { lat: -53.224, lng: -22.34 } }))
            .to.be.true;
    
          expect(_utils.isInBoundaries(
            { lat: 103.324, lng: -40.313 }, 
            { sw: { lat: 103.224, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }))
            .to.be.true;
        });
    
        it('latitude should be outside the boundaries', () => {
          expect(_utils.isInBoundaries(
            { lat: 38.783484, lng: -122.4117937 }, 
            { sw: { lat: 37.77765, lng: -122.4187887 }, ne: { lat: 37.789046, lng: -122.3947557 } }))
            .to.be.false;
    
          expect(_utils.isInBoundaries(
            { lat: -55.324, lng: -22.44 },  
            { sw: { lat: 103.324, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }))
            .to.be.false;
    
          expect(_utils.isInBoundaries(
            { lat: 104.324, lng: -40.313 }, 
            { sw: { lat: 103.324, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }))
            .to.be.false;
        });
    
        it('longitude should be outside the boundaries', () => {
          expect(_utils.isInBoundaries(
            { lat: 37.783484, lng: -123.4117937 }, 
            { sw: { lat: 37.77765, lng: -122.4187887 }, ne: { lat: 37.789046, lng: -122.3947557 } }))
            .to.be.false;
    
          expect(_utils.isInBoundaries(
            { lat: -53.324, lng: -23.44 }, 
            { sw: { lat: -53.424, lng: -22.54 }, ne: { lat: -53.224, lng: -22.34 } }))
            .to.be.false;
      
          expect(_utils.isInBoundaries(
            { lat: 103.324, lng: -39.313 }, 
            { sw: { lat: 103.224, lng: -40.323 }, ne: { lat: 103.424, lng: -40.223 } }))
            .to.be.false;
        });
      });
    });

    describe('by Radius', () => {
      describe('getBoundariesFromRadius()', () => {
        it('boundaries should be correctly calculated', () => {
          expect(_utils.getBoundariesFromRadius({ lat: 37.783484, lng: -123.4117937 }, 5))
          .to.be.deep.equal(
            { sw: { lat: 37.73825150497557, lng: -123.46862497893275 },
            ne: { lat: 37.82871649502443, lng: -123.35496242106726 } });
  
          expect(_utils.getBoundariesFromRadius({ lat: -53.324, lng: -23.44 }, 5))
          .to.be.deep.equal(
            { sw: { lat: -53.36923249502443, lng: -23.515199007738865 },
            ne: { lat: -53.27876750497557, lng: -23.364800992261138 } });
  
          expect(_utils.getBoundariesFromRadius({ lat: 103.324, lng: -39.313 }, 5))
          .to.be.deep.equal(
            { sw: { lat: 103.27876750497558, lng: -39.118102520855395 },
            ne: { lat: 103.36923249502442, lng: -39.50789747914461 } });
        });
      });
  
      describe('isInRadius()', () => {
        it('location should be within the radius of 5 kilometers', () => {
          expect(_utils.isInRadius(
            { lat: 37.8324, lng: 112.5384 }, 
            { lat: 37.8321, lng: 112.5384 }, 5))
            .to.be.true;
    
          expect(_utils.isInRadius(
            { lat: -53.324, lng: -23.44 }, 
            { lat: -53.322, lng: -23.41 }, 5))
            .to.be.true;
    
          expect(_utils.isInRadius(
            { lat: 103.324, lng: -39.313 },
            { lat: 103.323, lng: -39.313 }, 5))
            .to.be.true;
        });
    
        it('location should be within the radius of 20 kilometers', () => {
          expect(_utils.isInRadius(
            { lat: 37.8324, lng: 112.5384 }, 
            { lat: 37.7324, lng: 112.5384 }, 20))
            .to.be.true;
    
          expect(_utils.isInRadius(
            { lat: -53.324, lng: -23.44 }, 
            { lat: -53.322, lng: -23.31 }, 20))
            .to.be.true;
      
          expect(_utils.isInRadius(
            { lat: 103.324, lng: -39.313 },
            { lat: 103.313, lng: -39.213 }, 20))
            .to.be.true;
        });
    
        it('location should be outside the radius of 5 kilometers', () => {
          expect(_utils.isInRadius(
            { lat: 37.8324, lng: 112.5384 }, 
            { lat: 37.7324, lng: 115.5384 }, 5))
            .to.be.false;
    
          expect(_utils.isInRadius(
            { lat: -52.324, lng: -23.44 }, 
            { lat: -53.322, lng: -23.41 }, 5))
            .to.be.false;
      
          expect(_utils.isInRadius(
            { lat: 102.324, lng: -36.313 },
            { lat: 103.323, lng: -39.313 }, 5))
            .to.be.false;
        });
      });
    });
  });

  describe('Mathematical calculations', () => {
    describe('degreesToRadians()', () => {
      it('should convert positive degrees correctly to radians', () => {
        expect(_utils.degreesToRadians(1)).to.be.equal(0.017453292519943295);
        expect(_utils.degreesToRadians(34)).to.be.closeTo(0.593412, 0.0001);
        expect(_utils.degreesToRadians(100)).to.be.closeTo(1.74533, 0.0001);
        expect(_utils.degreesToRadians(0)).to.be.closeTo(0, 0.0001);
        expect(_utils.degreesToRadians(19.9)).to.be.closeTo(0.3473205, 0.0001);
        expect(_utils.degreesToRadians(300)).to.be.closeTo(5.23599, 0.0001);
        expect(_utils.degreesToRadians(120)).to.be.closeTo(2.0944, 0.0001);
      });

      it('should convert negative degrees correctly to radians', () => {
        expect(_utils.degreesToRadians(-1)).to.be.equal(-0.017453292519943295);
        expect(_utils.degreesToRadians(-34)).to.be.closeTo(-0.593412, 0.0001);
        expect(_utils.degreesToRadians(-100)).to.be.closeTo(-1.74533, 0.0001);
        expect(_utils.degreesToRadians(-0)).to.be.closeTo(0, 0.0001);
        expect(_utils.degreesToRadians(-19.9)).to.be.closeTo(-0.3473205, 0.0001);
        expect(_utils.degreesToRadians(-300)).to.be.closeTo(-5.23599, 0.0001);
        expect(_utils.degreesToRadians(-120)).to.be.closeTo(-2.0944, 0.0001);
      });
    });

    describe('distBtwLocations()', () => {
      it('should calculate the right distance between two different locations', () => {
        expect(_utils.distBtwLocations(
          { lat: 37.8324, lng: 112.5384 }, 
          { lat: 36.8324, lng: 113.5384 }))
          .to.be.equal(142.05236890137257);
  
        expect(_utils.distBtwLocations(
          { lat: -52.324, lng: -23.44 },  
          { lat: -52.524, lng: -21.44 }))
          .to.be.closeTo(137.4, 0.5);
  
        expect(_utils.distBtwLocations(
          { lat: 102.324, lng: -36.313 },
          { lat: 150, lng: -39.313 }))
          .to.be.closeTo(5304, 1);
      });

      it('should calculate the right distance between two similair locations', () => {
        expect(_utils.distBtwLocations(
          { lat: 37.8324, lng: 112.5384 }, 
          { lat: 37.8324, lng: 112.5384 }))
          .to.be.equal(0);

        expect(_utils.distBtwLocations(
          { lat: -52.524, lng: -21.44 },  
          { lat: -52.524, lng: -21.44 }))
          .to.be.equal(0);

        expect(_utils.distBtwLocations(
          { lat: 150, lng: -39.313 },
          { lat: 150, lng: -39.313 }))
          .to.be.equal(0);
      });
    });  
    
    describe('caluclatePrecisionFromBoundaries()', () => {
      it('should calculate the precisions correctly', () => {
        expect(_utils.caluclatePrecisionFromBoundaries(
          { sw: { lat: 37.82855150497557, lng: -123.46862497893275 },
          ne: { lat: 37.82871649502443, lng: -123.45496242106726 } }))
          .to.be.equal(6);

        expect(_utils.caluclatePrecisionFromBoundaries(
          { sw: { lat: 37.73825150497557, lng: -123.46862497893275 },
          ne: { lat: 37.82871649502443, lng: -123.35496242106726 } }))
          .to.be.equal(5);

        expect(_utils.caluclatePrecisionFromBoundaries(
          { sw: { lat: 36.73825150497557, lng: -123.46862497893275 },
          ne: { lat: 37.82871649502443, lng: -123.35496242106726 } }))
          .to.be.equal(4);

        expect(_utils.caluclatePrecisionFromBoundaries(
          { sw: { lat: 34.73825150497557, lng: -123.46862497893275 },
          ne: { lat: 37.82871649502443, lng: -123.35496242106726 } }))
          .to.be.equal(3);
      });
    });
  });
});