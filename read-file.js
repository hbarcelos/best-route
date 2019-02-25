const { readFile } = require('fs');
const { promisify } = require('util');
const { compose, then } = require('ramda');

const readFileAsync = promisify(readFile);

const bufferToString = ({ encoding }) => buffer => buffer.toString(encoding);

const createReader = ({ encoding }) => compose(
    then(bufferToString({ encoding })),
    readFileAsync
);

module.exports = createReader({ encoding: 'utf8' });
module.exports.createReader = createReader;