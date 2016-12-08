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
 * Filter and order colors
 *
 * Remove shades of gray: if variance(r, g b) > opts.greyVa(=100)
 * Merge close colors:
 * 1. sort colors by occurrence
 * 2. iterate the colors starting by the most common -> c1
 *    iterate the other and less common colors -> c2
 *    if distance(c1, c2) < opts.dist(=100)
 *      c2 <- c1
 *
 *
 * @param colors {string[]} - array of hex colors
 * @param opts {Object=} - options
 * @returns {Array} - the filtered and ordered colors
 */
Helpers.prototype.filter = function (colors, opts) {
  const options = {
    dist: opts.dist || 100,
    greyVa: opts.greyVa || 100,
  };

  colors = colors.filter(c => {
    const rgb = this.hexToRgb(c);
    const moy = (rgb.r + rgb.g + rgb.b) / 3;
    const va = (rgb.r - moy) * (rgb.r - moy) + (rgb.g - moy) * (rgb.g - moy) + (rgb.b - moy) * (rgb.b - moy);

    if (va > options.greyVa)
      return c;
  });

  const countsObj = {};
  const colorsArr = [];

  for (let c of colors) {
    countsObj[c] = countsObj[c] ? countsObj[c] + 1 : 1;
  }

  for (let c in countsObj) {
    if (!/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c))
      continue;

    colorsArr.push({
      color: c,
      n: countsObj[c],
    });
  }

  colorsArr.sort((a, b) => b.n - a.n);

  for (let i = 0; i < colorsArr.length - 1; i++) {
    const rgb = this.hexToRgb(colorsArr[i].color);

    for (let j = i + 1; j < colorsArr.length; j++) {
      const rgbNext = this.hexToRgb(colorsArr[j].color);
      const dist = Math.sqrt((rgbNext.r - rgb.r) * (rgbNext.r - rgb.r) + (rgbNext.g - rgb.g) * (rgbNext.g - rgb.g) + (rgbNext.b - rgb.b) * (rgbNext.b - rgb.b));

      if (dist < options.dist)
        colorsArr[j].color = colorsArr[i].color;
    }
  }

  return colorsArr;
};

module.exports = new Helpers();
