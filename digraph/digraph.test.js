const test = require('tape-catch');
const subject = require('./digraph');
const EdgeSet = require('./edge-set');

const isObject = arg => Object(arg) === arg;

test('Factory function return type', t => {
    const actual = isObject(subject());
    const expected = true

    t.is(actual, expected, 'should create an object');
    t.end();
});

test('Factory parameters: none', t => {
    t.doesNotThrow(subject, Error, 'should not throw if called with no arguments');
    t.end();
});

test('Factory parameters: .edges is missing', t => {
    const instance = subject({});
    const actual = instance.edges;
    const expected = EdgeSet([]);

    t.deepEqual(actual, expected, 'should create an empty EdgeSet');
    t.end();
});

test('Factory parameters: .nodes is missing', t => {
    const instance = subject({
        edges: EdgeSet([
            { from: 'a', to: 'b', weight: 1 },
        ]),
    });
    const actual = instance.nodes;
    const expected = ['a', 'b'];

    t.deepEqual(actual, expected, 'should derive the list of nodes from the egdes');
    t.end();
});

test('.hasNode()', t => {
    const instance = subject({
        edges: EdgeSet([
            { from: 'a', to: 'b', weight: 1 },
        ]),
    });

    t.true(instance.hasNode('a'), 'should return true for existing node');
    t.false(instance.hasNode('unexistend'), 'should return false for unexisting node');

    t.end();
});

const fixtures = [
    {
        description: "acyclic single-path graph",
        input: [
            { from: 'a', to: 'b', weight: 1 },
            { from: 'b', to: 'c', weight: 3 },
            { from: 'c', to: 'd', weight: 5 },
        ],
        path: {
            from: 'a',
            to: 'd',
        },
        expected: [
            { from: 'a', to: 'b', weight: 1 },
            { from: 'b', to: 'c', weight: 3 },
            { from: 'c', to: 'd', weight: 5 },
        ],
    },
    {
        description: "acyclic multi-path graph",
        input: [
            { from: 'a', to: 'b', weight: 1 },
            { from: 'a', to: 'c', weight: 1 },
            { from: 'b', to: 'c', weight: 5 },
            { from: 'b', to: 'c', weight: 3 },
            { from: 'c', to: 'd', weight: 7 },
        ],
        path: {
            from: 'a',
            to: 'd',
        },
        expected: [
            { from: 'a', to: 'c', weight: 1 },
            { from: 'c', to: 'd', weight: 7 },
        ],
    },
    {
        description: "cyclic multi-path graph",
        input: [
            { from: 'c', to: 'b', weight: 13 },
            { from: 'a', to: 'b', weight: 1 },
            { from: 'c', to: 'd', weight: 17 },
            { from: 'a', to: 'c', weight: 3 },
            { from: 'b', to: 'c', weight: 7 },
            { from: 'b', to: 'a', weight: 5 },
            { from: 'b', to: 'd', weight: 11 },
        ],
        path: {
            from: 'a',
            to: 'd',
        },
        expected: [
            { from: 'a', to: 'b', weight: 1 },
            { from: 'b', to: 'd', weight: 11 },
        ],
    },
];

test('.shortestPath()', t => {
    t.plan(fixtures.length);

    fixtures.forEach(({ description, input, path, expected }) => {
        const instance = subject({
            edges: EdgeSet(input),
        });

        const actual = instance.shortestPath(path);

        t.deepEqual(actual, expected, description);
    });
});