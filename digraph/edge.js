function validate({ from, to, weight }) {
    if (!from) {
        throw new Error(`Invalid edge attribute "from": ${from}`);
    }
     
    if (!to) {
        throw new Error(`Invalid edge attribute "to": ${to}`);
    }

    if (!weight || Number.isNaN(weight)) {
        throw new Error(`Invalid edge attribute "weight": ${weight}`);
    }

    return { from, to, weight}
}

function Edge({ from, to, weight } = {}) {
    return  Object.freeze(validate({
        from: from && String(from),
        to: to && String(to),
        weight: weight && parseInt(weight, 10),
    }));
}

module.exports = Edge;