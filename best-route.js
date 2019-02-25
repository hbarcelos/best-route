const { inspect } = require('util');
const { compose, then, all } = require('ramda');
const readFile = require('./read-file');
const parseAvailableRoutes = require('./parse-available-routes');
const parseQueryRoute = require('./parse-query-route')

const parseInputFile = compose(
    then(parseAvailableRoutes),
    readFile,
)

const validateRoute = (graph, route) => {
    Object.values(route).forEach(node => {
        const isValid = graph.nodes.includes(node);
        if (!isValid) {
            throw new Error(`Node ${inspect(node)} doesn't exist in available routes`);
        }
    })
}

const validateArguments = ([file, route]) => {
    if (!file || !route) {
        throw new Error(`Usage: best-route <routes-file> "<FROM> - <TO>"`)
    }

    return [file, route];
}

const formatBestRoute = shortestPath => shortestPath.reduce(
    (acc, { from, to }) =>
        acc === ''
            ? `${from} - ${to}`
            : `${acc} - ${to}`, 
    ''
)

async function main() {
    try {
        const [fileArg, routeArg] = validateArguments(process.argv.slice(2));

        const graph = await parseInputFile(fileArg);
        const route = parseQueryRoute(routeArg)

        validateRoute(graph, route);

        const shortestPath = graph.shortestPath(route);

        console.log(formatBestRoute(shortestPath));
    } catch (err) {
        console.error(err.message);
    }
}

main();