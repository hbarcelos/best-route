const path = require('path');
const test = require('tape');
const tapReporter = require('tap-spec');

test.createStream()
  .pipe(tapReporter())
  .pipe(process.stdout);

process.argv.slice(2).forEach(file => {
    require(path.resolve(file));
});