'use strict';

const PNG = require('pngjs').PNG;

const helpers = require('./src/helpers');

const exporter = {};

exporter.extract = function (stream, opts) {
  opts = opts || {};
  opts.background = opts.background || '#FFFFFF';
  opts.alphaMin = opts.alphaMin || 0;

  return new Promise((resolve, reject) => {
    const colors = [];

    stream
    .pipe(new PNG({
      filterType: -1,
    }))
    .on('error', reject)
    .on('parsed', function () {
      const backgroundRGB = helpers.hexToRgb(opts.background);

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          const o = this.data[idx + 3] / 255;

          if (o < opts.alphaMin / 255)
            continue;

          const r = Math.floor((1 - o) * backgroundRGB.r + o * this.data[idx]);
          const g = Math.floor((1 - o) * backgroundRGB.g + o * this.data[idx + 1]);
          const b = Math.floor((1 - o) * backgroundRGB.b + o * this.data[idx + 2]);

          colors.push({ r, g, b });
        }
      }

      resolve(helpers.filter(colors, opts));
    });
  });
};

module.exports = exporter;
