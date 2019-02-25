# Best Route

## Summary

Given a file containing all available flight prices between different airports and the desired origin and destination, it gives you the best (cheapest) route.

## Environment Setup

This project uses Node.js as runtime environment and Yarn as package manager.

Requirements: 

- [Node.js](https://nodejs.org/dist/v11.10.0/) >= 11.0.0
- [Yarn](https://yarnpkg.com/en/docs/install) >= 1.13.0

After installing the packages above, clone this repository:

```bash
git clone https://github.com/hbarcelos/best-route.git
```

Switch to the project folder:

```bash
cd best-route
```

## Dependencies

Once in the project folder, run to install the project dependencies:

```bash
yarn install
```

## Usage

```bash
yarn start <ROUTES_FILE> "<FROM> - <TO>"
```

## Testing

```bash
yarn test <TEST_FILE>
```

## Architectural Overview

### File structure

```
./
├── digraph/
│   ├── digraph.js
│   ├── digraph.test.js
│   ├── edge-set.js
│   ├── edge-set.test.js
│   ├── edge.js
│   ├── edge.test.js
│   ├── index.js
│   ├── priority-queue.js
│   └── priority-queue.test.js
├── csv.js
├── index.js
├── package.json
├── parse-available-routes.js
├── parse-query-route.js
├── read-file.js
├── sample-input.csv
├── test-runner.js
└── yarn.lock
```

### Remarks

- Within the `digraph` folder lies the implementation of a Directed Graph, which provides a `.shortestPath()` method that is used to find the best route.
    - `digraph.Digraph#shortestPath()` implements a slightly modified version of the [Dijkstra's Shortest Path First algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).
    - Instead of relying solely on arrays and maps, `digraph.EdgeSet` is a higher-level representation of graph edges.
    - `digraph.PriorityQueue` is used by `digraph.Digraph#shortestPath()` to allow prioritization of the cheapest nodes during graph traversal.
- `parseAvailableRoutes` is a pure functional pipeline to parse the routes CSV representation into a `digraph.Digraph` instance.
- `parseQueryRoute` will parse the second CLI param: the desired route.
- `csv` module is another pure functional pipeline to parse CSV text into JavaScript arrays.
    - It works only with in-memory CSV. The file read is performed in the `main` function in `index.js` before calling this function.
- `readFile` is a convenience wrapper around Node.js native `fs` module.