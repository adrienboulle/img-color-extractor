'use strict';

const fs = require('fs');

const colorExtractor = require('./../index');

const stream = fs.createReadStream(__dirname + '/in.png')
.on('err', e => console.error(e));

colorExtractor.extract(stream, { greyVa: 1, dist: 40 })
.then(colors => console.log(colors));
