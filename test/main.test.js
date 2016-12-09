'use strict';

const expect = require('expect.js');

const fs = require('fs');

const colorExtractor = require('./../index');

let stream;

beforeEach(() => {
  stream = fs.createReadStream(__dirname + '/in.png')
  .on('error', () => expect(true).to.be(false));
});

it('should find more than one color', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream)
  .then(colors => {
    expect(colors.length).to.be.greaterThan(1);

    done();
  });
});

it('should find only the main color #ffffff with greyVa = -1 and dist > dMax ~462', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: -1, dist: 50000 })
  .then(colors => {
    expect(colors.length).to.be(1);
    expect(colors[0].n).to.be(2080747);
    expect(colors[0].r).to.be(1);
    expect(colors[0].color).to.be('#ffffff');

    done();
  });
});

it('should find only the main color #000000 with greyVa = -1, dist > dMax ~462 and background: #000000', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: -1, dist: 500, background: '#000000' })
  .then(colors => {
    expect(colors.length).to.be(1);
    expect(colors[0].n).to.be(2080747);
    expect(colors[0].color).to.be('#000000');

    done();
  });
});

it('should ignore all pixels with alpha < 255', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: -1, dist: 500, alphaMin: 255 })
  .then(colors => {
    expect(colors[0].n).to.be(557249);

    done();
  });
});

it('should keep all pixels with minimum greyVa', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: -1, dist: 500, alphaMin: 0 })
  .then(colors => {
    expect(colors[0].n).to.be(2080747);

    done();
  });
});

it('should skip all pixels with maximum greyVa', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: 20000, dist: 500, alphaMin: 0 })
  .then(colors => {
    expect(colors.length).to.be(0);

    done();
  });
});

it('should find only the main color ##f3306b with greyVa = 200, dist > dMax ~462 and background: #f3306b', function (done) {
  this.timeout(20000);

  colorExtractor.extract(stream, { greyVa: 200, dist: 500, background: '#f3306b' })
  .then(colors => {
    expect(colors.length).to.be(1);
    expect(colors[0].color).to.be('#f3306b');

    done();
  });
});
