const { compose, map } = require('ramda');
const csv = require('./csv');
const { Digraph, EdgeSet, Edge } = require("./digraph");

const graphFromEdges = (edges) => Digraph({ edges });

const parseEdges = ([from, to, weight]) => Edge({ from, to, weight });

module.exports = compose(
    graphFromEdges,
    EdgeSet,
    map(parseEdges),
    csv.fromString,
)