const deepMerge = require('deepmerge');
const deepEqual = require('deep-equal');
const Edge = require('./edge');

const prototype = {
    add(edge) {
        return EdgeSet([...this.items, edge]);
    },
    remove(edge) {
        return EdgeSet(this.items.filter(el => !deepEqual(el, edge)));
    },
    has(edge, { ignoreWeight = false } = {}) {
        const predicate = ignoreWeight 
            ? ({ from, to }) => deepEqual({ from: edge.from, to: edge.to }, { from, to })
            : ({ from, to, weight }) => deepEqual(edge, { from, to, weight });

        return !!this.allFrom(edge.from).find(predicate);
    },
    allFrom(node) {
        return this.indexes.from[node] || [];
    },
    allTo(node) {
        return this.indexes.to[node] || [];
    },
    cheapest({ from, to }) {
        const validEdges = this
            .allFrom(from)
            .filter(edge => edge.to === to);

        if (validEdges.length === 0) {
            throw new Error(`There is no available path from "${from}" to "${to}"`);
        }

        return validEdges.reduce(
            (acc, { weight }) => weight < acc ? weight : acc, 
            Number.MAX_SAFE_INTEGER
        );
    }
};

function EdgeSet(inputEdges) {
    const edges = [...inputEdges].map(Edge);

    const metadata = edges.reduce(
        (acc, edge) => {
            const indexes = deepMerge({ 
                from: acc.indexes.from, 
                to: acc.indexes.to 
            }, { 
                from: { [edge.from]: [edge] },
                to: { [edge.to]: [edge] },
            });
            const nodes = [...new Set([...acc.nodes, edge.from, edge.to])];

            return { nodes, indexes };
        },
        {
            indexes: {
                from: {},
                to: {},
            },
            nodes: [],
        }
    );
    
    const { indexes, nodes } = metadata;

    return Object.freeze(Object.create(prototype, {
        items:{
            value: edges,
            enumerable: true,
        },
        nodes: {
            value: nodes,
        },
        indexes: {
            value: indexes,
        },
        [Symbol.iterator]: {
            value: function* delegateIterator() {
                yield* edges[Symbol.iterator]();
            },
        },
    }));
}

module.exports = EdgeSet;