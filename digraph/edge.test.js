const test = require('tape-catch');
const subject = require('./edge');

test('Factory params: no param', t => {
    t.throws(subject, 'Should throw when instantiated with no params');
    t.end();
});

test('Factory params: invalid', t => {
    t.throws(() => subject({ from: 10}), 'Should throw when .from is not a string');
    t.throws(() => subject({ to: 10}), 'Should throw when .to is not a string');
    t.throws(() => subject({ weight: 'invalid'}), 'Should throw when .weight is not a valid number');
    t.end();
});

test('Factory params: all valid', t => {
    const actual = subject({ from: 'a', to: 'b', weight: 10 });
    const expected = { from: 'a', to: 'b', weight: 10 };

    t.deepEqual(actual, expected);
    t.end();
});

test('Factory params: all valid, weight is a string', t => {
    const actual = subject({ from: 'a', to: 'b', weight: '10' });
    const expected = { from: 'a', to: 'b', weight: 10 };

    t.deepEqual(actual, expected, 'should convert weight to Number');
    t.end();
});