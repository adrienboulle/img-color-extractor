'use strict';

const Helpers = function () {};

/**
 * Transform a base 10 value to its base 16 value
 *
 * @param c - base 10 value
 * @returns {string} - the base 16 value
 */
Helpers.prototype.componentToHex = function (c) {
  const hex = c.toString(16);

  return hex.length == 1 ? '0' + hex : hex;
};

/**
 * Transform base 10 r g b color il its hex code
 *
 * @param r - base 10 red component value
 * @param g - base 10 green component value
 * @param b - base 10 blue component value
 * @returns {string} - the hex value
 */
Helpers.prototype.rgbToHex = function (r, g, b) {
  return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
};

/**
 * Transform hex color in its base 10 r g b components
 *
 * @param hex - hex color (i.e. #F3306B)
 * @returns {Object} - the base 10 r g b color (i.e. { r: 243, g: 48, b: 107 })
 */
Helpers.prototype.hexToRgb = function (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * Filter and order colorsArrStr
 *
 * Remove shades of gray: if variance(r, g b) > opts.greyVa(=100)
 * Merge close colorsArrStr:
 * 1. sort colorsArrStr by occurrence
 * 2. iterate the colorsArrStr starting by the most common -> c1
 *    iterate the other and less common colorsArrStr -> c2
 *    if distance(c1, c2) < opts.dist(=100)
 *      c2 <- c1
 *
 * @param colorsArrStr {string[]} - array of hex colorsArrStr
 * @param opts {Object=} - options
 * @returns {Array} - the filtered and ordered colors (e.g. [{ color: `hexa`, n: `numberOfOccurrence`, r: `ratio` }, ...]
 */
Helpers.prototype.filter = function (colorsArrStr, opts) {
  opts = opts || {};
  const options = {
    dist: opts.dist || 100,
    greyVa: opts.greyVa || -1,
  };

  let countsObj = {};
  let colorsArrObj = [];

  for (let c of colorsArrStr) {
    if (options.greyVa >= 0) {
      const moy = (c.r + c.g + c.b) / 3;
      const va = ((c.r - moy) * (c.r - moy) + (c.g - moy) * (c.g - moy) + (c.b - moy) * (c.b - moy)) / 3;

      if (va <= options.greyVa)
        continue;
    }

    const cHex = this.rgbToHex(c.r, c.g, c.b);
    countsObj[cHex] = countsObj[cHex] ? countsObj[cHex] + 1 : 1;
  }

  for (let c in countsObj) {
    colorsArrObj.push({
      color: c,
      n: countsObj[c],
    });
  }

  colorsArrObj.sort((a, b) => b.n - a.n);

  countsObj = {};
  let total = 0;

  for (let i = 0; i < colorsArrObj.length; i++) {
    countsObj[colorsArrObj[i].color] = colorsArrObj[i].n;

    let n = 0;
    const rgb = this.hexToRgb(colorsArrObj[i].color);

    for (let j = i + 1; j < colorsArrObj.length; j++) {
      if (typeof colorsArrObj[j].color === 'undefined')
        continue;

      const rgbNext = this.hexToRgb(colorsArrObj[j].color);
      const dist = Math.sqrt((rgbNext.r - rgb.r) * (rgbNext.r - rgb.r) + (rgbNext.g - rgb.g) * (rgbNext.g - rgb.g) + (rgbNext.b - rgb.b) * (rgbNext.b - rgb.b));

      if (dist < options.dist) {
        n += colorsArrObj[j].n;
        colorsArrObj.splice(j, 1);
        j--;
      }
    }

    countsObj[colorsArrObj[i].color] += n;
    total += countsObj[colorsArrObj[i].color];
  }

  const colorsArrObjRet = [];

  for (let c in countsObj) {
    colorsArrObjRet.push({
      color: c,
      n: countsObj[c],
      r: Number((countsObj[c] / total).toFixed(10)),
    });
  }

  return colorsArrObjRet.sort((a, b) => b.n - a.n);
};

module.exports = new Helpers();
