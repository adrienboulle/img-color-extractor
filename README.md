# img-color-extractor
Node module to extract main colors from a PNG image

## Installation

```sh
$ npm install --save img-color-extractor
```

##Usage


###JavaScript
```
const fs = require('fs');
const colorExtractor = require('img-color-extractor');

stream = fs.createReadStream('/test/in.png')

defaultsOptions = {
    background: '#FFFFFF';
    alphaMin: 0;
    dist: 100,
    greyVa: -1,
};

colorExtractor.extract(stream, defaultsOptions)
.then(colors => {
    console.log(colors) // [ { color: '#ffffff', n: 1515551, r: 0.728368706 },
                        //   { color: '#333333', n: 388783, r: 0.1868478003 },
                        //   { color: '#669f64', n: 174227, r: 0.0837329094 },
                        //   { color: '#b2ceb1', n: 2186, r: 0.0010505842 } ]
});
```
 
![alt text](https://github.com/adboul/img-color-extractor/blob/master/test/out.png?raw=true "NodeJS logo")

# License

MIT
