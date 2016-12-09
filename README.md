# img-color-extractor
Node module to extract REAL main colors from a PNG image

REAL mean that if #333333 and #669F64 are the most present colors in a picture,
img-color-extractor will extract exactly #333333 and #669F64 and not some color between the two.

## Installation

```sh
$ npm install --save img-color-extractor
```

##Usage

```
const fs = require('fs');
const colorExtractor = require('img-color-extractor');

stream = fs.createReadStream('/test/in.png')

defaultsOptions = {
    background: '#FFFFFF',
    alphaMin: 0,
    dist: 100,
    greyVa: -1,
};

// retun a promise resolving an array of objects as:
// [{ color: `hexa`, n: `numberOfOccurrence`, r: `ratio` }, ...]
colorExtractor.extract(stream, opts)
.then(colors => {
    console.log(colors) // [ { color: '#ffffff', n: 1515551, r: 0.728368706 },
                        //   { color: '#333333', n: 388783, r: 0.1868478003 },
                        //   { color: '#669f64', n: 174227, r: 0.0837329094 },
                        //   { color: '#b2ceb1', n: 2186, r: 0.0010505842 } ]
});
```
 
![alt text](https://github.com/adboul/img-color-extractor/blob/master/test/out.png?raw=true "NodeJS logo")

##Options
* `background` background color if input has alpha layer. default to `'#FFFFFF'` (white)

* `alphaMin` ignore all pixels with alpha layer under alphaMin. default to `0`<br>
 `0` keeps all, `256` or more removes all 

* `dist` distance for regrouping pixels by color. default to `100`<br>
distance is calculated as sqrt((r1 - r2)^2  + (g1 - g2)^2 + (b1 - b2)^2)`

* `greyVa` ignore all pixels with variance(r, g, b) < greyVa. default to `-1`<br>
useful to ignore shades of grey<br>
`-1` keeps all, `14451` or more removes all 

# License

MIT
