const Helpers = function () {};

Helpers.prototype.componentToHex = function(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

Helpers.prototype.rgbToHex = function(r, g, b) {
  return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
};

Helpers.prototype.hexToRgb = function(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

Helpers.prototype.removeTooClose = function(colors) {
  const countsObj = {};
  const colorsArr = [];

  for (let c of colors) {
    countsObj[c] = countsObj[c] ? countsObj[c] + 1 : 1;
  }

  for (let c in countsObj) {
    if (c === 'undefined' || c === '')
      continue;

    colorsArr.push({
      color: c,
      n: countsObj[c],
    })
  }

  colorsArr.sort((a, b) => {
    return b.n - a.n;
});

  for (let i = 0; i < colorsArr.length - 1; i++) {
    if (colorsArr[i].color === '')
      continue;

    const rgb = this.hexToRgb(colorsArr[i].color);

    for (let j = i + 1; j < colorsArr.length; j++) {
      if (colorsArr[j].color === '')
        continue;

      const rgbNext = this.hexToRgb(colorsArr[j].color);

      const dist = Math.sqrt((rgbNext.r - rgb.r) * (rgbNext.r - rgb.r) + (rgbNext.g - rgb.g) * (rgbNext.g - rgb.g) + (rgbNext.b - rgb.b) * (rgbNext.b - rgb.b));

      if (dist < 100)
        colorsArr[j].color = '';
    }
  }

  return colorsArr;
};

module.exports = new Helpers();
