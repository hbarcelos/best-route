const { inspect } = require('util');

module.exports = route => { 
    const [from, to] = route.split(/ ?- ?/); 
    if (!from || !to) {
        throw new Error(`Invalid query route: ${inspect({ from, to })}`)
    }
    return { from, to };
}