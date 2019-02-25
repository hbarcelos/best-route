const { compose, map, then } = require('ramda');
 
const splitLines = str => str.split(/\r\n?|\n/);

const splitColumns = str => str.split(',');
 
const fromString = compose(
    map(splitColumns),
    splitLines,
);

module.exports = { fromString };