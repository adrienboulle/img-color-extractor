'use strict';

const PNG = require('pngjs').PNG;

const helpers = require('./src/helpers');

const exporter = {};

exporter.extract = function (stream, opts) {
  return new Promise((resolve, reject) => {
    const colors = [];

    stream
    .pipe(new PNG({
      filterType: 4,
    }))
    .on('error', reject)
    .on('parsed', function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const r = this.data[idx];
          const g = this.data[idx + 1];
          const b = this.data[idx + 2];

          const hex = helpers.rgbToHex(r, g, b);

          colors.push(hex);
        }
      }

      resolve(helpers.filter(colors, opts));
    });
  });
};

module.exports = exporter;
