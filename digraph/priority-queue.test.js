const test = require('tape-catch');
const subject = require('./priority-queue');

test('.enqueue(): empty queue', t => {
    const instance = subject();
    const input = { node: 'a', priority: 1 }

    instance.enqueue(input);
    const actual = instance.dequeue();

    t.deepEqual(actual, input, 'should add to the beginning of the queue');
    t.end()
});

test('.enqueue(): with lowest value for priority', t => {
    const instance = subject();
    const input = { node: 'b', priority: 1 }

    instance.enqueue({ node: 'a', priority: 10 });
    instance.enqueue(input);

    const actual = instance.dequeue();

    t.deepEqual(actual, input, 'should add to the beginning of the queue');
    t.end()
});

test('.enqueue(): with highest value for priority', t => {
    const instance = subject();
    const input = { node: 'b', priority: 10 }

    instance.enqueue({ node: 'a', priority: 1 });
    instance.enqueue({ node: 'a', priority: 2 });
    instance.enqueue(input);
    instance.dequeue();
    instance.dequeue();

    const actual = instance.dequeue();

    t.deepEqual(actual, input, 'should add to the end of the queue');
    t.end()
});

test('.enqueue(): with value between lowest and highest for priority', t => {
    const instance = subject();
    const input = { node: 'c', priority: 10 }

    instance.enqueue({ node: 'a', priority: 1 });
    instance.enqueue({ node: 'b', priority: 20 });
    instance.enqueue(input);
    instance.dequeue();

    const actual = instance.dequeue();

    t.deepEqual(actual, input, 'should add to the middle of the queue');
    t.end()
});