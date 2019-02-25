const { inspect } = require('util');
const EdgeSet = require('./edge-set');
const PriorityQueue = require('./priority-queue');

const prototype = {
    hasNode(node) {
        return this.nodes.includes(node);
    },
    shortestPath({ from, to }) {
        const weights = this.nodes
            .reduce(
                (acc, node) => Object.assign(
                    acc,
                    { [node]: node === from ? 0 : Infinity },
                ),
                {}
            );
        const backtrace = {};
        const queue = PriorityQueue();

        queue.enqueue({ node: from, priority: 0 });

        while (!queue.isEmpty()) {
            const shortestStep = queue.dequeue();
            const currentNode = shortestStep.node;

            this.edges.allFrom(currentNode).forEach(neighbor => {
                const accumulatedWeight = weights[currentNode] + neighbor.weight;

                if (accumulatedWeight < weights[neighbor.to]) {
                    weights[neighbor.to] = accumulatedWeight;
                    backtrace[neighbor.to] = { from: currentNode, to: neighbor.to, weight: neighbor.weight };
                    queue.enqueue({ node: neighbor.to, accumulatedWeight });
                }
            });
        }

        const path = [];
        let lastStep = { from: to };

        while (lastStep.from !== from) {
            const previousStep = lastStep ;

            lastStep = backtrace[lastStep.from];

            if (!lastStep) {
                throw new Error(`Unreachable node ${inspect(previousStep.from)}`);
            }

            path.unshift(lastStep);
        }

        return path;
    }
}

function Digraph({ edges = EdgeSet([]), nodes = edges.nodes } = {}) {
    return Object.create(prototype, {
        nodes: {
            value: nodes,
            enumerable: true,
        },
        edges: {
            value: edges,
            enumerable: true,
        },
    })
}

module.exports = Digraph;