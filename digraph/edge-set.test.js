const test = require('tape-catch');
const subject = require('./edge-set');

test("Factory params: input is another EdgeSet object", t => {
    const actual = subject(subject([{ from: 'a', to: 'b', weight: 1 }]));
    const expected = subject([{ from: 'a', to: 'b', weight: 1 }]);

    t.deepEqual(actual, expected, 'should create a not nested object');
    t.end();
});

test("Return structure: .nodes", t => {
    const actual = subject([{ from: 'a', to: 'b', weight: 1 }]).nodes;
    const expected = ['a', 'b'];

    t.deepEqual(actual, expected, 'should should obtain the list of nodes from the edges');
    t.end();
});

test("Iterability", t => {
    const actual = [...subject([{ from: 'a', to: 'b', weight: 1 }])];
    const expected = [{ from: 'a', to: 'b', weight: 1 }];

    t.deepEqual(actual, expected);
    t.end();
});

test(".allFrom(): node has edges coming from it", t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ]);

    const actual = instance.allFrom('a');
    const expected = [
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
    ];

    t.deepEqual(actual, expected);
    t.end();
});

test(".allFrom(): node has edges coming from it", t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ]);

    const actual = instance.allFrom('a');
    const expected = [
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
    ];

    t.deepEqual(actual, expected);
    t.end();
});

test(".allFrom(): no edges coming from node", t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ]);

    t.deepEqual(instance.allFrom('c'), [], 'Should return an empty array for nodes with no edges coming from them');
    t.deepEqual(instance.allFrom('unexistent'), [], 'Should return an empty array for unexistent nodes');
    t.end();
});
 
test(".allTo(): node has edges going towards it", t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ]);

    const actual = instance.allTo('c');
    const expected = [
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ];

    t.deepEqual(actual, expected);
    t.end();
});

test(".allFrom(): no edges going towards node", t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
    ]);

    t.deepEqual(instance.allTo('a'), [], 'Should return an empty array for nodes with no edges coming from them');
    t.deepEqual(instance.allTo('unexistent'), [], 'Should return an empty array for unexistent nodes');
    t.end();
});

test('.add()', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
    ]);

    const actual = instance.add({ from: 'b', to: 'c', weight: 1 });
    const expected = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 }
    ]);


    t.not(actual, instance, 'Should not mutate the original object');
    t.deepEqual(actual, expected, 'Should create a new object appending the new edge to the edge list');
    t.end()
});

test('.remove()', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 }
    ]);

    const actual = instance.remove({ from: 'b', to: 'c', weight: 1 });
    const expected = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
    ]);

    t.not(actual, instance, 'Should not mutate the original object');
    t.deepEqual(actual, expected, 'Should create a new object removing the specified edge from the list');
    t.end()
});

test('.has(): default behavior', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 }
    ]);

    t.true(instance.has({ from: 'a', to: 'b', weight: 1 }), 'Should return true for existing edge');
    t.false(instance.has({ from: 'a', to: 'b', weight: 8 }), 'Should return false for non-existing edge');
    t.end()
});

test('.has(): with .ignoreWeight option set to true', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'c', weight: 1 }
    ]);

    t.true(
        instance.has({ from: 'a', to: 'b' }, { ignoreWeight: true })
        , 'Should return true when .weight is missing'
    );
    t.true(
        instance.has({ from: 'a', to: 'b', weight: 200 }, { ignoreWeight: true }),
        'Should return true when .weight is present, but different from the value in the edge set'
    );
    t.end()
});

test('.cheapest(): existing path', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 10 },
        { from: 'a', to: 'c', weight: 1 },
    ]);

    const actual = instance.cheapest({ from: 'a', to: 'c' });
    const expected = 1;

    t.is(actual, expected, 'Should find the cheapest path');
    t.end()
});

test('.cheapest(): unexisting path', t => {
    const instance = subject([
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 10 },
        { from: 'a', to: 'c', weight: 1 },
    ]);

    t.throws(() => instance.cheapest({ from: 'b', to: 'c' }), 'should throw an error if path is not possible');

    t.end()
});